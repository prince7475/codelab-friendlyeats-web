import {
    collection,
    query,
    getDocs,
    doc,
    getDoc,
    addDoc,
    orderBy,
    Timestamp,
    onSnapshot,
    deleteDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase/clientApp";

// Mock LLM function that will be replaced with actual LLM integration
function generateItemMetadata(imageUrl) {
    // This is a placeholder that returns mock data
    // In production, this would call an LLM API to analyze the image
    return {
        name: "Generated Item Name",
        description: "This is a generated description for the uploaded item.",
        category: "others",
        style: ["casual"],
    };
}

export async function addWardrobeItem(userId, imageUrl) {
    try {
        if (!userId) throw new Error("User ID is required");
        if (!imageUrl) throw new Error("Image URL is required");

        // Generate metadata using LLM (mock for now)
        const metadata = generateItemMetadata(imageUrl);

        // Create the wardrobe item document in user's subcollection
        const wardrobeRef = collection(db, `users/${userId}/wardrobe_items`);
        
        const itemData = {
            imageUrl,
            name: metadata.name,
            description: metadata.description,
            category: metadata.category,
            style: metadata.style,
            createdAt: Timestamp.fromDate(new Date()),
        };

        const docRef = await addDoc(wardrobeRef, itemData);
        
        return {
            id: docRef.id,
            ...itemData,
        };
    } catch (error) {
        console.error("Error adding wardrobe item:", error);
        throw error;
    }
}

export async function getWardrobeItems(userId) {
    try {
        if (!userId) throw new Error("User ID is required");

        const wardrobeRef = collection(db, `users/${userId}/wardrobe_items`);
        const q = query(wardrobeRef, orderBy("createdAt", "desc"));
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error getting wardrobe items:", error);
        throw error;
    }
}

export function getWardrobeItemsSnapshot(userId, callback) {
    try {
        if (!userId) throw new Error("User ID is required");
        if (typeof callback !== "function") {
            throw new Error("Callback must be a function");
        }

        const wardrobeRef = collection(db, `users/${userId}/wardrobe_items`);
        const q = query(wardrobeRef, orderBy("createdAt", "desc"));

        // Set up real-time listener
        return onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(items);
        });
    } catch (error) {
        console.error("Error setting up wardrobe items snapshot:", error);
        throw error;
    }
}

export async function getWardrobeItemById(userId, itemId) {
    try {
        if (!userId) throw new Error("User ID is required");
        if (!itemId) throw new Error("Item ID is required");

        const docRef = doc(db, `users/${userId}/wardrobe_items`, itemId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("Item not found");
        }

        return {
            id: docSnap.id,
            ...docSnap.data(),
        };
    } catch (error) {
        console.error("Error getting wardrobe item:", error);
        throw error;
    }
}

export async function deleteWardrobeItem(userId, itemId) {
    try {
        if (!userId) throw new Error("User ID is required");
        if (!itemId) throw new Error("Item ID is required");

        const itemRef = doc(db, `users/${userId}/wardrobe_items/${itemId}`);
        
        // Get the item first to retrieve the image URL
        const itemSnap = await getDoc(itemRef);
        if (!itemSnap.exists()) {
            throw new Error("Item not found");
        }

        // Delete the document
        await deleteDoc(itemRef);
        
        // Return the deleted item's data (including imageUrl) for cleanup
        return {
            id: itemId,
            ...itemSnap.data()
        };
    } catch (error) {
        console.error("Error deleting wardrobe item:", error);
        throw error;
    }
}
