// src/services/firestoreService.js
import {
    deleteDoc,
    doc,
    getFirestore,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import appFirebase from "../../FirebaseConfig";

const db = getFirestore(appFirebase);

/**
 * Agrega una tarea a Firestore y retorna el uuid
 */
export const addTaskFirestore = async (task) => {
    const uuid = task.uuid; // asumimos que ya tiene uuid
    const docRef = doc(db, "tasks", uuid);
    await setDoc(docRef, task);
    return uuid;
};

/**
 * Actualiza una tarea existente usando record_uuid y payload
 */
export const updateTaskFirestore = async (uuid, payload) => {
    const docRef = doc(db, "tasks", uuid);
    await updateDoc(docRef, payload);
};

/**
 * Elimina una tarea de Firestore por uuid
 */
export const deleteTaskFirestore = async (uuid) => {
    const docRef = doc(db, "tasks", uuid);
    await deleteDoc(docRef);
};

/**
 * Lo mismo podés hacer para categorías
 */
export const addCategoryFirestore = async (category) => {
    const uuid = category.uuid;
    const docRef = doc(db, "categories", uuid);
    await setDoc(docRef, category);
    return uuid;
};

export const updateCategoryFirestore = async (uuid, payload) => {
    const docRef = doc(db, "categories", uuid);
    await updateDoc(docRef, payload);
};

export const deleteCategoryFirestore = async (uuid) => {
    const docRef = doc(db, "categories", uuid);
    await deleteDoc(docRef);
};
