import type {Model} from "firebase-admin/machine-learning";
import { db } from "./firebase_client.js";
import { collection, orderBy, getDocs } from "firebase/firestore"

export async function getModels() {
    const modelsRef = collection(db, 'models');
    const snapshot = await getDocs(modelsRef);
    let models: Model[] = [];
    snapshot.forEach(doc => {
        models.push(doc.data() as Model);
    });
    return models;
}