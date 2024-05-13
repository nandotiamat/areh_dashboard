import {  getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "$lib/server/firebase_client.js";
import { generateQRCode, uploadQRCodeToStorage } from "$lib/server/qr_code.js";
import {saveModelToFirestore} from "$lib/server/firestore.js";

async function uploadFileAndGetURL(fieldName: string, fileName: string, documentID: string, formData: FormData): Promise<string | null> {
    const file = formData.get(fieldName) as File;
    if (file instanceof File) {
        const storageRef = ref(storage, `models/${documentID}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload of ${fileName} is ${progress}% done`);
                },
                (error) => {
                    console.error(`Error uploading ${fileName} file:`, error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log(`File available at ${fileName} download URL:`, downloadURL);
                        resolve(downloadURL);
                    }).catch((error) => {
                        console.error(`Error getting ${fileName} download URL:`, error);
                        reject(error);
                    });
                }
            );
        });
    } else {
        console.warn(`You must provide a file for the upload`);
        return null;
    }
};

export async function POST({ request }: { request: Request }) {
    try {
        const formData = await request.formData();

        if (formData) {
            const name = formData.get('name') as string;
            const category = formData.get('category') as string;
            const subtitle = formData.get('subtitle') as string;
            const bottom_text = formData.get('bottom_text') as string;

            let sections: { name: string; entries: { key: string; value: string }[] }[] = [];
            const sectionsString = formData.get('sections') as string;
            if (sectionsString) {
                sections = JSON.parse(sectionsString);
            }
            
            const docRef = await saveModelToFirestore(name, category, subtitle, bottom_text, sections);
            const documentID = docRef.id;

            // Upload the files if provided and save URLs
            await uploadFileAndGetURL('imageURL', 'poster.png', documentID, formData);
            await uploadFileAndGetURL('videoURL', 'video.mp4', documentID, formData);
            await uploadFileAndGetURL('glbURL', 'model.glb', documentID, formData);
            await uploadFileAndGetURL('usdzURL', 'model.usdz', documentID, formData);

            const qrCodeImage = await generateQRCode(documentID);
            await uploadQRCodeToStorage(qrCodeImage, documentID);

            return new Response(JSON.stringify({ status: 200 }), {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
        } else {
            return new Response('Invalid request data', {
                status: 400,
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        return new Response('Internal Server Error', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
};


