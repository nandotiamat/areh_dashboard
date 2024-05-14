import { db, storage } from "$lib/server/firebase_client.js";
import {deleteDoc, doc} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject, listAll } from "firebase/storage";
import { adminBucket } from "$lib/server/firebase_admin.js";
import {modifyModelOnFirestore} from "$lib/server/firestore.js";


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
}


export async function POST({ request }: { request: Request }) {
    try {
        const formData = await request.formData();
        const documentID = formData.get('documentID') as string;

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

            // Upload the files if provided and save URLs
            await uploadFileAndGetURL('imageURL', 'poster.png', documentID, formData);
            await uploadFileAndGetURL('videoURL', 'video.mp4', documentID, formData);
            await uploadFileAndGetURL('glbURL', 'model.glb', documentID, formData);
            await uploadFileAndGetURL('usdzURL', 'model.usdz',  documentID, formData);

            await modifyModelOnFirestore(documentID, name, category, subtitle, bottom_text, sections);



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
}
//TODO: add delete qr folder if it is separated from the other model's files

// DELETE function
export async function DELETE({ params }: { params: { id: string } }) {
    try {
        const documentID = params.id;

        // Delete model data from Firestore
        await deleteDoc(doc(db, "models", documentID));
        await deleteModelFolder(documentID);

        return new Response(JSON.stringify({ status: 200 }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error deleting model:', error);
        return new Response('Internal Server Error', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}

// Function to delete model folder from Firebase Storage
async function deleteModelFolder(documentID: string) {
    try {
        const folderPath = `models/${documentID}`;

        await adminBucket.deleteFiles({
            prefix: folderPath,
            force: true,
        });

        console.log(`Folder ${folderPath} deleted successfully.`);
    } catch(error) {
        console.error(`Error deleting folder: ${error}`);
        throw error;
    }
}
