import type { Model } from "$lib/types.js";
import { db, storageRef} from "./firebase_client.js";
import { storage } from "./firebase_client.js";
import { collection, orderBy, getDocs, query } from "firebase/firestore"
import { ref,} from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

export async function getModels() {
    const modelsRef = collection(db, 'models');
    const q = query(modelsRef, orderBy('__name__')); // Order by document ID
    const snapshot = await getDocs(q);
    let models: Model[] = [];
    await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data() as Model;
        (data as Model).documentID = doc.id;

        const imageRef = ref(storage, `models/${doc.id}/poster.png`);
        const videoRef = ref(storage, `models/${doc.id}/video.mp4`);

        const imageUrlPromise = getDownloadURL(imageRef);
        const videoUrlPromise = getDownloadURL(videoRef);

        const [imageUrl, videoUrl] = await Promise.all([imageUrlPromise, videoUrlPromise]);

        data.imageURL = imageUrl;
        data.videoURL = videoUrl;

        models.push(data);
    }));

        models.sort((a, b) => a.documentID.localeCompare(b.documentID));

    return models;
}
