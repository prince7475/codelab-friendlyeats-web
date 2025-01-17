import {
    collection,
    query,
    getDocs,
    doc,
    getDoc,
    addDoc,
    deleteDoc,
    orderBy,
    Timestamp,
    serverTimestamp,
    onSnapshot,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase/clientApp";
import { uploadInspirationImage, deleteCollectionImages } from "@/src/lib/firebase/storage";

/**
 * Creates a new outfit collection for a user
 * @param {string} userId - The ID of the user
 * @param {Object} collectionData - The collection data
 * @param {string} collectionData.name - The name of the collection
 * @param {string} collectionData.description - The description of the collection
 * @param {Object[]} collectionData.inspirationImages - Array of objects containing inspiration image files
 * @param {File} collectionData.inspirationImages.file - The inspiration image file
 * @returns {Promise<string>} The ID of the created collection
 */
export async function createOutfitCollection(userId, collectionData) {
    try {
        // Create collection document first to get the ID
        const collectionRef = collection(db, 'users', userId, 'outfitCollections');
        const docRef = await addDoc(collectionRef, {
            name: collectionData.name,
            description: collectionData.description,
            inspirationImages: [],
            outfits: [],
            createdAt: serverTimestamp(),
        });

        // Upload inspiration images with collection ID
        const imageUploadPromises = collectionData.inspirationImages.map(image => 
            uploadInspirationImage(userId, image.file, docRef.id)
        );
        const inspirationImageUrls = await Promise.all(imageUploadPromises);

        // Update collection with image URLs
        await updateDoc(docRef, {
            inspirationImages: inspirationImageUrls
        });

        return docRef.id;
    } catch (error) {
        console.error('Error creating outfit collection:', error);
        throw error;
    }
}

/**
 * Gets all outfit collections for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of outfit collections
 */
export async function getOutfitCollections(userId) {
    try {
        const collectionsRef = collection(db, 'users', userId, 'outfitCollections');
        const q = query(collectionsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting outfit collections:', error);
        throw error;
    }
}

/**
 * Gets real-time updates for outfit collections
 * @param {string} userId - The ID of the user
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export function getOutfitCollectionsSnapshot(userId, callback) {
    try {
        const collectionsRef = collection(db, 'users', userId, 'outfitCollections');
        const q = query(collectionsRef, orderBy('createdAt', 'desc'));
        
        return onSnapshot(q, (snapshot) => {
            const collections = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(collections);
        }, (error) => {
            console.error('Error getting outfit collections snapshot:', error);
            throw error;
        });
    } catch (error) {
        console.error('Error setting up outfit collections snapshot:', error);
        throw error;
    }
}

/**
 * Gets a single outfit collection by ID
 * @param {string} userId - The ID of the user
 * @param {string} collectionId - The ID of the collection
 * @returns {Promise<Object>} The outfit collection
 */
export async function getOutfitCollectionById(userId, collectionId) {
    try {
        const collectionRef = doc(db, 'users', userId, 'outfitCollections', collectionId);
        const docSnap = await getDoc(collectionRef);
        
        if (!docSnap.exists()) {
            throw new Error('Collection not found');
        }

        return {
            id: docSnap.id,
            ...docSnap.data()
        };
    } catch (error) {
        console.error('Error getting outfit collection:', error);
        throw error;
    }
}

/**
 * Updates an outfit collection
 * @param {string} userId - The ID of the user
 * @param {string} collectionId - The ID of the collection
 * @param {Object} updateData - The data to update
 * @returns {Promise<void>}
 */
export async function updateOutfitCollection(userId, collectionId, updateData) {
    try {
        const collectionRef = doc(db, 'users', userId, 'outfitCollections', collectionId);
        await updateDoc(collectionRef, updateData);
    } catch (error) {
        console.error('Error updating outfit collection:', error);
        throw error;
    }
}

/**
 * Deletes an outfit collection
 * @param {string} userId - The ID of the user
 * @param {string} collectionId - The ID of the collection
 * @returns {Promise<void>}
 */
export async function deleteOutfitCollection(userId, collectionId) {
    try {
        // Delete all images in the collection's storage folder
        await deleteCollectionImages(userId, collectionId);

        // Delete the collection document
        const docRef = doc(db, 'users', userId, 'outfitCollections', collectionId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting outfit collection:', error);
        throw error;
    }
}

/**
 * Adds a generated outfit to a collection
 * @param {string} userId - The ID of the user
 * @param {string} collectionId - The ID of the collection
 * @param {Object} outfitData - The outfit data
 * @returns {Promise<void>}
 */
export async function addOutfitToCollection(userId, collectionId, outfitData) {
    try {
        const docRef = doc(db, 'users', userId, 'outfitCollections', collectionId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error('Collection not found');
        }

        const newOutfit = {
            id: `outfit-${Date.now()}`,
            createdAt: Timestamp.fromDate(new Date()),
            ...outfitData
        };

        await updateDoc(docRef, {
            outfits: arrayUnion(newOutfit)
        });
    } catch (error) {
        console.error('Error adding outfit to collection:', error);
        throw error;
    }
}