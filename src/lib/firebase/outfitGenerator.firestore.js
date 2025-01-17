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
import { GoogleGenerativeAI } from "@google/generative-ai";

import { 
    generateItemMetadata,
} from '@/src/lib/firebase/wardrobe.firestore';
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
        // First, analyze all inspiration images
        const imageAnalysisPromises = collectionData.inspirationImages.map(async (image) => {
            const metadata = await generateItemMetadata(image.file);
            return metadata;
        });

        // Wait for all image analyses to complete
        // If any analysis fails, the entire Promise.all will fail
        const imageMetadataList = await Promise.all(imageAnalysisPromises);

        // Generate collection metadata using all image metadata
        const collectionMetadata = await generateCollectionMetadata(imageMetadataList);

        // Create collection document first to get the ID
        const collectionRef = collection(db, 'users', userId, 'outfitCollections');
        const docRef = await addDoc(collectionRef, {
            name: collectionData.name,
            description: collectionData.description,
            inspirationImages: [], // Will be updated after image upload
            outfits: [],
            metadata: collectionMetadata,
            createdAt: serverTimestamp(),
        });

        // Upload inspiration images with collection ID and create enriched image objects
        const imageUploadPromises = collectionData.inspirationImages.map(async (image, index) => {
            const url = await uploadInspirationImage(userId, image.file, docRef.id);
            return {
                url,
                metadata: imageMetadataList[index]
            };
        });

        // Wait for all image uploads to complete
        const enrichedInspirationImages = await Promise.all(imageUploadPromises);

        // Update collection with enriched image data
        await updateDoc(docRef, {
            inspirationImages: enrichedInspirationImages
        });

        return docRef.id;
    } catch (error) {
        console.error('Error creating outfit collection:', error);
        // If any step fails, we'll throw the error and let the caller handle it
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

/**
 * Generates collection metadata using LLM based on inspiration images
 * @param {Object[]} imageMetadataList - Array of image metadata objects
 * @returns {Promise<Object>} Collection metadata including tags and description
 */
export async function generateCollectionMetadata(imageMetadataList) {
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyBizf6hwPtSmiVUrtEqcg6apnDewYVDVXw");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Format the metadata into a descriptive string for each item
        const formattedDescriptions = imageMetadataList.map((metadata, index) => {
            return `Item ${index + 1}:
            Name: ${metadata.name}
            Description: ${metadata.description}
            Colors: ${metadata.colors.join(', ')}
            Styles: ${metadata.styles.join(', ')}
            Occasions: ${metadata.occasions.join(', ')}
            Category: ${metadata.category}`;
        });

        // Prepare the prompt
        const prompt = `Analyze these outfit inspiration items and provide:
        1. A set of style tags that represent the overall style theme
        2. A detailed description of the style being aimed for
        3. A confidence score for this analysis

        Inspiration Items to analyze:
        ${formattedDescriptions.join('\n\n')}

        Return ONLY a JSON object with these exact keys (no markdown formatting):
        {
            "tags": string[],
            "description": string,
            "confidenceScore": number
        }`;

        // Generate content
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const analysisText = response.text();
        
        // Extract JSON from markdown if present
        const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || [null, analysisText];
        const jsonString = jsonMatch[1].trim();
        
        // Parse the JSON response
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating collection metadata:", error);
        throw new Error("Failed to analyze collection style. Please try again.");
    }
}

/**
 * Generates outfit suggestion with confidence score
 * @param {Object} params - Generation parameters
 * @param {string} params.collectionDescription - Collection description
 * @param {string[]} params.collectionTags - Collection tags
 * @param {Object[]} params.wardrobeItems - Available wardrobe items
 * @returns {Promise<Object>} Generated outfit with confidence score
 */
export async function generateOutfitSuggestion({ collectionDescription, collectionTags, wardrobeItems }) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PRIVATE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare the prompt
        const prompt = `Generate an outfit based on the following:

        Style Description: ${collectionDescription}
        Style Tags: ${collectionTags.join(', ')}

        Available Wardrobe Items:
        ${wardrobeItems.map(item => `- ${item.description} (ID: ${item.id})`).join('\n')}

        Create an outfit that matches the style description using only the available wardrobe items.
        For each selected item, explain why it fits the desired style.

        Return ONLY a JSON object with these exact keys (no markdown formatting):
        {
            "items": [
                {
                    "id": string,
                    "reason": string
                }
            ],
            "confidenceScore": number,
            "explanation": string
        }

        The confidence score should be between 0 and 1, representing how well the generated outfit matches the desired style.
        The explanation should describe why this outfit works well together and how it achieves the desired style.`;

        // Generate content
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const analysisText = response.text();
        
        // Extract JSON from markdown if present
        const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || [null, analysisText];
        const jsonString = jsonMatch[1].trim();
        
        // Parse the JSON response
        const suggestion = JSON.parse(jsonString);

        // Validate that all selected items exist in wardrobe
        const wardrobeIds = new Set(wardrobeItems.map(item => item.id));
        const allItemsExist = suggestion.items.every(item => wardrobeIds.has(item.id));
        
        if (!allItemsExist) {
            throw new Error("Generated outfit contains invalid wardrobe items");
        }

        return suggestion;
    } catch (error) {
        console.error("Error generating outfit suggestion:", error);
        throw new Error("Failed to generate outfit suggestion. Please try again.");
    }
}