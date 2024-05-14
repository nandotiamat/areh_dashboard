import type { Model } from "$lib/types.js";
import { db, storage } from "./firebase_client.js";
import { collection, getDocs, query, doc, addDoc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

async function getStorageUrls(docID: string) {
    const modelRef = ref(storage, `models/${docID}`);
    const imageRef = ref(storage, `${modelRef}/poster.png`);
    const videoRef = ref(storage, `${modelRef}/video.mp4`);
    const glbRef = ref(storage, `${modelRef}/model.glb`);
    const usdzRef = ref(storage, `${modelRef}/model.usdz`);
    const qrCodeRef = ref(storage, `${modelRef}/qr.png`);

    const [imageUrl, videoUrl, glbUrl, usdzUrl, qrCodeUrl] = await Promise.all([
        getDownloadURL(imageRef).catch(handleError),
        getDownloadURL(videoRef).catch(handleError),
        getDownloadURL(glbRef).catch(handleError),
        getDownloadURL(usdzRef).catch(handleError),
        getDownloadURL(qrCodeRef).catch(handleError),
    ]);

    return { imageUrl, videoUrl, glbUrl, usdzUrl,qrCodeUrl };
}

function handleError(error: any) {
    if (error.code === 'storage/object-not-found') {
        return ""; // set url to  "" if file not found
    } else {
        throw error;
    }
}

export async function getModels() {
    const modelsRef = collection(db, 'models');
    const _query = query(modelsRef); 
    const snapshot = await getDocs(_query);
    let models: Model[] = [];

    await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data() as Model;
        data.documentID = doc.id;

        const { imageUrl, videoUrl, glbUrl, usdzUrl, qrCodeUrl } = await getStorageUrls(doc.id);

        // Ensure default values for properties if they are undefined
        data.name = data.name || "";
        data.category = data.category || "";
        data.subtitle = data.subtitle || "";
        data.sections = data.sections || [
      {
        name: "",
        entries: [
          {
            key: "",
            value: "",
          },
        ],
      },
    ]; // Ensure sections is an empty array if undefined
        data.bottom_text = data.bottom_text || "";

        data.imageURL = imageUrl || "";
        data.videoURL = videoUrl || "";
        data.glbURL = glbUrl || "";
        data.usdzURL = usdzUrl || "";
        data.qrCodeURL = qrCodeUrl || "";

        models.push(data);
    }));

    models.sort((a, b) => a.documentID.localeCompare(b.documentID));

    return models;
}

export async function saveModelToFirestore(name: string, category: string, subtitle: string, bottom_text: string, sections: any[]) {
    try {
        const docRef = await addDoc(collection(db, 'models'), {
            name,
            category,
            subtitle,
            bottom_text,
            sections,
        });
        console.log(`Document written with ID: ${docRef.id}`);
        return docRef;
    } catch (error) {
        console.error('Error adding document:', error);
        throw error;
    }
}

export async function modifyModelOnFirestore(documentID, name, category, subtitle, bottom_text, sections) {
    const docRef = doc(db, "models", documentID);
    await setDoc(docRef, {
        name,
        category,
        subtitle,
        bottom_text,
        sections
    });
}