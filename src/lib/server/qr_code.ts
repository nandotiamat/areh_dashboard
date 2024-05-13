import {ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "./firebase_client.js";


export async function generateQRCode(documentID: string) {
    const qrCodeApiURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${documentID}`;

    try {
        const response = await fetch(qrCodeApiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'applicaion/x-www-form-urlencoded'
            },
        });

        if (response.ok){
            const qrCodeImage = await response.blob();
            return qrCodeImage;
        } else {
            throw new Error(`Failed to generate QR code: ${response.statusText}`);
        }


    } catch(error ) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

export async function uploadQRCodeToStorage(qrCodeImage,documentID){
    try {
        const storageRef = ref(storage, `qr/models/model_${documentID}.png`);
        const uploadTask = uploadBytesResumable(storageRef, qrCodeImage);

        return new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => { 
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload of QR code is ${progress}% done`);
                },
                (error) => {
                    console.error('Error uploading QR code:', error);
                    reject(error);
                },
                () => {
                    console.log('QR code uploaded successfully');
                    resolve();
                }
            );
        });


    } catch(error){
        console.error('Error uploading QR code:', error);
        throw error;
    }
}

