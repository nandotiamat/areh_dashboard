import type { Model } from "$lib/types.js";
import { db, storage } from "./firebase_client.js";
import { collection, orderBy, getDocs, query } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

async function getStorageUrls(docID: string) {
    const modelRef = ref(storage, `models/${docID}`);
    const imageRef = ref(storage, `${modelRef}/poster.png`);
    const videoRef = ref(storage, `${modelRef}/video.mp4`);
    const glbRef = ref(storage, `${modelRef}/model.glb`);
    const usdzRef = ref(storage, `${modelRef}/model.usdz`);

    const [imageUrl, videoUrl, glbUrl, usdzUrl] = await Promise.all([
        getDownloadURL(imageRef).catch(handleError),
        getDownloadURL(videoRef).catch(handleError),
        getDownloadURL(glbRef).catch(handleError),
        getDownloadURL(usdzRef).catch(handleError)
    ]);

    return { imageUrl, videoUrl, glbUrl, usdzUrl };
}

function handleError(error: any) {
    if (error.code === 'storage/object-not-found') {
        console.error('File not found:', error.message);
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

        const { imageUrl, videoUrl, glbUrl, usdzUrl } = await getStorageUrls(doc.id);

        data.imageURL = imageUrl;
        data.videoURL = videoUrl;
        data.glbURL = glbUrl;
        data.usdzURL = usdzUrl;

        console.log(videoUrl);

        models.push(data);
    }));

    models.sort((a, b) => a.documentID.localeCompare(b.documentID));

    return models;
}
