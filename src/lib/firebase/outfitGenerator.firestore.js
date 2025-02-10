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
 * @param {string} collectionData.prompt - Optional user prompt for collection creation
 * @returns {Promise<string>} The ID of the created collection
 */
export async function createOutfitCollection(userId, collectionData) {
    try {
        // Get user's wardrobe items with metadata
        const wardrobeRef = collection(db, `users/${userId}/wardrobe_items`);
        const wardrobeSnapshot = await getDocs(wardrobeRef);
        const wardrobeItems = wardrobeSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Get existing collections for context
        const collectionsRef = collection(db, 'users', userId, 'outfitCollections');
        const collectionsSnapshot = await getDocs(collectionsRef);
        const existingCollections = collectionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Generate collection metadata using Gemini
        const genAI = new GoogleGenerativeAI("AIzaSyBizf6hwPtSmiVUrtEqcg6apnDewYVDVXw");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Based on the following wardrobe items and existing collections, ${collectionData.prompt ? 
            `create a collection that matches this description: "${collectionData.prompt}"` : 
            'suggest a new and unique collection that would work well with these items'}.

Wardrobe Items (with detailed metadata):
${wardrobeItems.map(item => `
- ${item.name}:
  Description: ${item.description}
  Colors: ${item.colors?.join(', ')}
  Styles: ${item.styles?.join(', ')}
  Occasions: ${item.occasions?.join(', ')}
  Category: ${item.category}
`).join('\n')}

Existing Collections:
${existingCollections.map(col => `- ${col.name}: ${col.description}`).join('\n')}

Please provide the following in JSON format:
{
    "name": "Collection name (max 50 chars)",
    "description": "Detailed description of the collection style and theme (max 500 chars)",
    "tags": ["array", "of", "style", "tags"],
    "styleGuide": "Brief style guide for creating outfits in this collection",
    "suggestedOccasions": ["array", "of", "occasions", "this", "collection", "works", "for"]
}`;

        const result = await model.generateContent(prompt);
        const response = result.response;

        // Helper function to clean and parse AI response
        const cleanAndParseJSON = (text) => {
            console.group('AI Response Debug');
            console.log('Raw response:', text);
            
            try {
                // First try direct parsing in case it's already clean JSON
                try {
                    const directParse = JSON.parse(text);
                    console.log('Direct parse successful');
                    console.groupEnd();
                    return directParse;
                } catch (e) {
                    console.log('Direct parse failed, trying cleanup...');
                }
                
                // Remove markdown code blocks if present
                let cleaned = text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/gi, '$1');
                console.log('After markdown cleanup:', cleaned);
                
                // Remove any non-JSON text before or after the JSON object
                cleaned = cleaned.replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1');
                console.log('After JSON extraction:', cleaned);
                
                // Remove any remaining whitespace and normalize
                cleaned = cleaned.trim();
                console.log('Final cleaned version:', cleaned);
                
                const parsed = JSON.parse(cleaned);
                console.log('Parse successful:', parsed);
                console.groupEnd();
                return parsed;
            } catch (error) {
                console.error('All parsing attempts failed:', error);
                console.log('Failed text:', text);
                console.groupEnd();
                throw new Error('Failed to parse AI response: ' + error.message);
            }
        };

        const metadata = cleanAndParseJSON(response.text());

        // Create collection document
        const docRef = await addDoc(collectionsRef, {
            name: metadata.name,
            description: metadata.description,
            metadata: {
                tags: metadata.tags,
                styleGuide: metadata.styleGuide,
                suggestedOccasions: metadata.suggestedOccasions,
                userPrompt: collectionData.prompt || null,
                generatedAt: serverTimestamp(),
            },
            outfits: [],
            createdAt: serverTimestamp(),
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
        // Get the collection to access its metadata and style information
        const collectionRef = doc(db, 'users', userId, 'outfitCollections', collectionId);
        const collectionDoc = await getDoc(collectionRef);
        
        if (!collectionDoc.exists()) {
            throw new Error('Collection not found');
        }

        const collectionData = collectionDoc.data();

        // Get all wardrobe items
        const wardrobeRef = collection(db, 'users', userId, 'wardrobe_items');
        const wardrobeSnapshot = await getDocs(wardrobeRef);
        const wardrobeItems = wardrobeSnapshot.docs.map(doc => ({
            id: doc.id,
            metadata: doc.data()
        }));

        // Generate outfit suggestion
        const suggestion = await generateOutfitSuggestion({
            collectionDescription: collectionData.metadata.description,
            collectionTags: collectionData.metadata.tags,
            wardrobeItems,
            occasion: outfitData.description // Use the user's input description as the occasion
        });

        // Create a map of wardrobe items for easy lookup
        const wardrobeItemsMap = wardrobeItems.reduce((acc, item) => {
            acc[item.id] = item.metadata;
            return acc;
        }, {});

        // Enrich the items with image URLs and names
        const enrichedItems = suggestion.items.map(item => ({
            ...item,
            image: wardrobeItemsMap[item.id].imageUrl, // Add the image URL
            name: wardrobeItemsMap[item.id].name // Add the item name
        }));

        // Create the outfit document with the suggestion and additional metadata
        const outfitDoc = {
            title: outfitData.title,
            description: outfitData.description,
            items: enrichedItems,
            confidenceScore: suggestion.confidenceScore,
            explanation: suggestion.explanation,
            createdAt: Timestamp.now()
        };

        // Update the collection with the new outfit
        await updateDoc(collectionRef, {
            outfits: arrayUnion(outfitDoc)
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
        const response = result.response;

        // Helper function to clean and parse AI response
        const cleanAndParseJSON = (text) => {
            console.group('AI Response Debug');
            console.log('Raw response:', text);
            
            try {
                // First try direct parsing in case it's already clean JSON
                try {
                    const directParse = JSON.parse(text);
                    console.log('Direct parse successful');
                    console.groupEnd();
                    return directParse;
                } catch (e) {
                    console.log('Direct parse failed, trying cleanup...');
                }
                
                // Remove markdown code blocks if present
                let cleaned = text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/gi, '$1');
                console.log('After markdown cleanup:', cleaned);
                
                // Remove any non-JSON text before or after the JSON object
                cleaned = cleaned.replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1');
                console.log('After JSON extraction:', cleaned);
                
                // Remove any remaining whitespace and normalize
                cleaned = cleaned.trim();
                console.log('Final cleaned version:', cleaned);
                
                const parsed = JSON.parse(cleaned);
                console.log('Parse successful:', parsed);
                console.groupEnd();
                return parsed;
            } catch (error) {
                console.error('All parsing attempts failed:', error);
                console.log('Failed text:', text);
                console.groupEnd();
                throw new Error('Failed to parse AI response: ' + error.message);
            }
        };

        const metadata = cleanAndParseJSON(response.text());
        
        // Extract JSON from markdown if present
        // const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || [null, analysisText];
        // const jsonString = jsonMatch[1].trim();
        
        // Parse the JSON response
        return metadata;
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
 * @param {string} params.occasion - Description of where the user is going
 * @returns {Promise<Object>} Generated outfit with confidence score
 */
export async function generateOutfitSuggestion({ collectionDescription, collectionTags, wardrobeItems, occasion }) {
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyBizf6hwPtSmiVUrtEqcg6apnDewYVDVXw");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare the prompt
        const prompt = `Create a realistic outfit for the following occasion and style:

        Occasion: ${occasion}
        Style Description: ${collectionDescription}
        Style Tags: ${collectionTags.join(', ')}

        Available Wardrobe Items:
        ${wardrobeItems.map(item => `
        - ID: ${item.id}
          Name: ${item.metadata.name}
          Description: ${item.metadata.description}
          Category: ${item.metadata.category}
          Colors: ${item.metadata.colors.join(', ')}
          Styles: ${item.metadata.styles.join(', ')}
          Occasions: ${item.metadata.occasions.join(', ')}`).join('\n')}

        Requirements:
        1. Create ONE realistic outfit that the user can wear
        2. Must include exactly one pair of shoes and one pair of pants/bottoms
        3. Can include multiple top layers if appropriate (e.g., shirt + sweater + coat)
        4. Consider color coordination, style matching, and occasion appropriateness
        5. Explain why each item was chosen and how they complement each other

        Return ONLY a JSON object with these exact keys (no markdown formatting):
        {
            "items": [
                {
                    "id": string,
                    "reason": string (explain why this item was chosen and how it complements the outfit)
                }
            ],
            "confidenceScore": number (between 0 and 1),
            "explanation": string (overall explanation of the outfit, including how it matches the style and occasion)
        }`;

        // Generate content
        const result = await model.generateContent([prompt]);
        const response = result.response;

        // Helper function to clean and parse AI response
        const cleanAndParseJSON = (text) => {
            console.group('AI Response Debug');
            console.log('Raw response:', text);
            
            try {
                // First try direct parsing in case it's already clean JSON
                try {
                    const directParse = JSON.parse(text);
                    console.log('Direct parse successful');
                    console.groupEnd();
                    return directParse;
                } catch (e) {
                    console.log('Direct parse failed, trying cleanup...');
                }
                
                // Remove markdown code blocks if present
                let cleaned = text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/gi, '$1');
                console.log('After markdown cleanup:', cleaned);
                
                // Remove any non-JSON text before or after the JSON object
                cleaned = cleaned.replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1');
                console.log('After JSON extraction:', cleaned);
                
                // Remove any remaining whitespace and normalize
                cleaned = cleaned.trim();
                console.log('Final cleaned version:', cleaned);
                
                const parsed = JSON.parse(cleaned);
                console.log('Parse successful:', parsed);
                console.groupEnd();
                return parsed;
            } catch (error) {
                console.error('All parsing attempts failed:', error);
                console.log('Failed text:', text);
                console.groupEnd();
                throw new Error('Failed to parse AI response: ' + error.message);
            }
        };

        const suggestion = cleanAndParseJSON(response.text());
        
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