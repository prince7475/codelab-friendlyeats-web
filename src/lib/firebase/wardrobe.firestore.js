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
import { GoogleGenerativeAI } from "@google/generative-ai";

// Export the function for use in hooks
export async function generateItemMetadata(file) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PRIVATE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert file to base64
        const base64data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        // Prepare the prompt
        const prompt = `Analyze this clothing item image and provide:
        1. A brief name for the item
        2. A detailed description of the item
        3. Colors present in the item (up to 10 color tags)
        4. Style tags that describe this item's style (up to 10 tags)
        5. Occasions where this item would be appropriate (up to 10 occasions)
        6. A category for this item
        7. Whether this is a wearable clothing item (true/false)
        8. A confidence score (0-100) for this analysis

        For colors, include both specific shades (e.g., navy blue, forest green) and basic colors (e.g., blue, green).
        For styles, include descriptive terms like: casual, formal, bohemian, streetwear, etc.
        For occasions, include specific scenarios like: office work, casual friday, beach day, formal dinner, etc.

        Return ONLY a JSON object with these exact keys (no markdown formatting):
        {
            "name": string,
            "description": string,
            "colors": string[],
            "styles": string[],
            "occasions": string[],
            "category": string,
            "isWearable": boolean,
            "confidenceScore": number
        }`;

        // Generate content
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: file.type,
                    data: base64data
                }
            }
        ]);

        const response = await result.response;
        const analysisText = response.text();
        
        // Extract JSON from markdown if present
        const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || [null, analysisText];
        const jsonString = jsonMatch[1].trim();
        
        // Parse the JSON response
        const analysis = JSON.parse(jsonString);

        if (!analysis.isWearable) {
            throw new Error("The uploaded image does not appear to be a wearable clothing item");
        }

        return analysis;
    } catch (error) {
        console.error("Error analyzing item:", error);
        throw new Error("Failed to analyze clothing item. Please try again.");
    }
}

export async function addWardrobeItem(itemData) {
    try {
        if (!itemData.userId) throw new Error("User ID is required");
        if (!itemData.imageUrl) throw new Error("Image URL is required");

        // Create the wardrobe item document in user's subcollection
        const wardrobeRef = collection(db, `users/${itemData.userId}/wardrobe_items`);
        
        // Add timestamp to the item data
        const dataToAdd = {
            ...itemData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(wardrobeRef, dataToAdd);
        return {
            id: docRef.id,
            ...dataToAdd
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
