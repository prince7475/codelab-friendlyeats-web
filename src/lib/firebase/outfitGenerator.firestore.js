import {
    collection,
    query,
    getDocs,
    doc,
    addDoc,
    orderBy,
    Timestamp,
    onSnapshot,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase/clientApp";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateOutfit(userId, description, inspirationImage) {
    try {
        if (!userId) throw new Error("User ID is required");
        
        // TODO: Call Gemini API to analyze the inspiration image
        // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Analyze image and description to understand the style

        // TODO: Get user's wardrobe items
        // const wardrobeItems = await getWardrobeItems(userId);
        // Pass wardrobe items to LLM to generate outfit

        // Mock LLM response for now
        const mockOutfitData = {
            description: description,
            items: [
                {
                    id: '1',
                    name: 'Blue Oxford Shirt',
                    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
                    category: 'Tops'
                },
                {
                    id: '2',
                    name: 'Dark Jeans',
                    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
                    category: 'Bottoms'
                },
                {
                    id: '3',
                    name: 'White Sneakers',
                    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
                    category: 'Shoes'
                }
            ],
            createdAt: Timestamp.now()
        };

        // Save the generated outfit
        const savedOutfit = await saveOutfit(userId, mockOutfitData);
        return savedOutfit;

    } catch (error) {
        console.error("Error generating outfit:", error);
        throw new Error("Failed to generate outfit. Please try again.");
    }
}

export async function saveOutfit(userId, outfitData) {
    try {
        if (!userId) throw new Error("User ID is required");
        if (!outfitData) throw new Error("Outfit data is required");

        // Create the outfit document in user's subcollection
        const outfitsRef = collection(db, `users/${userId}/outfits`);
        
        const outfitToSave = {
            ...outfitData,
            createdAt: outfitData.createdAt || Timestamp.now()
        };

        const docRef = await addDoc(outfitsRef, outfitToSave);
        return {
            id: docRef.id,
            ...outfitToSave
        };

    } catch (error) {
        console.error("Error saving outfit:", error);
        throw new Error("Failed to save outfit. Please try again.");
    }
}

export async function getUserOutfits(userId) {
    try {
        if (!userId) throw new Error("User ID is required");

        const outfitsRef = collection(db, `users/${userId}/outfits`);
        const q = query(outfitsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {
        console.error("Error getting outfits:", error);
        throw new Error("Failed to get outfits. Please try again.");
    }
}

export function getUserOutfitsSnapshot(userId, callback) {
    try {
        if (!userId) throw new Error("User ID is required");
        if (!callback) throw new Error("Callback is required");

        const outfitsRef = collection(db, `users/${userId}/outfits`);
        const q = query(outfitsRef, orderBy("createdAt", "desc"));

        return onSnapshot(q, (snapshot) => {
            const outfits = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(outfits);
        }, (error) => {
            console.error("Error in outfits snapshot:", error);
            throw new Error("Failed to listen to outfits updates. Please try again.");
        });

    } catch (error) {
        console.error("Error setting up outfits snapshot:", error);
        throw new Error("Failed to set up outfits listener. Please try again.");
    }
}
