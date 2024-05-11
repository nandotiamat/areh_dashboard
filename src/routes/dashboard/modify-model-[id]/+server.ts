import { db, storage } from "$lib/server/firebase_client.js";
import {doc, setDoc} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

export async function POST({ request }: { request: Request }) {
    try {
        const formData = await request.formData();
        const documentID = formData.get('documentID') as string;

        if (formData) {
            // Extract form data
            const name = formData.get('name') as string;
            const category = formData.get('category') as string;
            const subtitle = formData.get('subtitle') as string;
            const bottom_text = formData.get('bottom_text') as string;
           
            let sections: { name: string; entries: { key: string; value: string }[] }[] = [];
            const sectionsString = formData.get('sections') as string;
            if (sectionsString) {
                sections = JSON.parse(sectionsString);
            }

            // Function to upload a file if provided and return URL
            const uploadFileAndGetURL = async (fieldName: string, fileName: string): Promise<string | null> => {
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
                    const existingValue = formData.get(fieldName) as string;
                        if (existingValue.trim() !== '') {
                            // If the existing value is non-empty, keep it
                            return existingValue;
                        } else {
                            // If the existing value is empty, no file to delete
                            const storageRef = ref(storage, `models/${documentID}/${fileName}`);
                            try {
                                await getDownloadURL(storageRef);
                                // If the getDownloadURL doesn't throw an error, the file exists, so we can delete it
                                await deleteObject(storageRef);
                            } catch (error) {
                                // If getDownloadURL throws an error, the file doesn't exist, so we can skip deletion
                                console.warn(`File '${fieldName}' does not exist.`, error);
                            }
                            return null;
                        }

                }
            };

            // Upload the files if provided and save URLs
            const imageURL = await uploadFileAndGetURL('imageURL', 'poster.png');
            const videoURL = await uploadFileAndGetURL('videoURL', 'video.mp4');
            const glbURL = await uploadFileAndGetURL('glbURL', 'model.glb');
            const usdzURL = await uploadFileAndGetURL('usdzURL', 'model.usdz');

            const docRef = doc(db, "models", documentID);
            await setDoc(docRef, {
                name,
                category,
                subtitle,
                bottom_text,
                sections
            });


            return new Response(JSON.stringify({ status: 200 }), {
                headers: {
                    'Content-Type': 'application/json'
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
}
