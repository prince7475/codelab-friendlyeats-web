import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from "firebase/storage";

import { storage } from "@/src/lib/firebase/clientApp";

import { updateRestaurantImageReference } from "@/src/lib/firebase/firestore";

export async function updateRestaurantImage(restaurantId, image) {
    try {
            if (!restaurantId)
                    throw new Error("No restaurant ID has been provided.");

            if (!image || !image.name)
                    throw new Error("A valid image has not been provided.");

            const publicImageUrl = await uploadImage(restaurantId, image);
            await updateRestaurantImageReference(restaurantId, publicImageUrl);

            return publicImageUrl;
    } catch (error) {
            console.error("Error processing request:", error);
    }
}

async function uploadImage(restaurantId, image) {
    const filePath = `images/${restaurantId}/${image.name}`;
    const newImageRef = ref(storage, filePath);
    await uploadBytesResumable(newImageRef, image);

    return await getDownloadURL(newImageRef);
}

export async function uploadWardrobeImage(userId, image) {
    try {
        if (!userId) {
            throw new Error("No user ID has been provided.");
        }

        if (!image || !image.name) {
            throw new Error("A valid image has not been provided.");
        }

        const filePath = `wardrobe/${userId}/${Date.now()}_${image.name}`;
        const newImageRef = ref(storage, filePath);
        await uploadBytesResumable(newImageRef, image);

        return await getDownloadURL(newImageRef);
    } catch (error) {
        console.error("Error uploading wardrobe image:", error);
        throw error;
    }
}

export async function deleteWardrobeImage(imageUrl) {
    try {
        if (!imageUrl) {
            throw new Error("No image URL has been provided.");
        }

        // Create a reference to the file to delete
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);

        return true;
    } catch (error) {
        console.error("Error deleting wardrobe image:", error);
        throw error;
    }
}

/**
 * Uploads an inspiration image to Firebase Storage
 * @param {string} userId - The ID of the user
 * @param {File} image - The image file to upload
 * @param {string} collectionId - The ID of the collection (optional for new collections)
 * @returns {Promise<string>} The download URL of the uploaded image
 */
export async function uploadInspirationImage(userId, image, collectionId = 'new') {
    try {
        if (!userId) {
            throw new Error("No user ID has been provided.");
        }
        console.log("uploadInspirationImage - image", image);
        if (!image || !image.name) {
            throw new Error("A valid image has not been provided.");
        }

        const filePath = `inspiring/${userId}/collection/${collectionId}/${Date.now()}_${image.name}`;
        const newImageRef = ref(storage, filePath);
        await uploadBytesResumable(newImageRef, image);

        return await getDownloadURL(newImageRef);
    } catch (error) {
        console.error("Error uploading inspiration image:", error);
        throw error;
    }
}

/**
 * Deletes all inspiration images for a collection
 * @param {string} userId - The ID of the user
 * @param {string} collectionId - The ID of the collection
 * @returns {Promise<void>}
 */
export async function deleteCollectionImages(userId, collectionId) {
    try {
        const folderRef = ref(storage, `inspiring/${userId}/collection/${collectionId}`);
        const folderPath = folderRef.fullPath;
        
        // List all files in the collection folder
        const { items } = await listAll(folderRef);
        
        // Delete each file
        const deletePromises = items.map(item => deleteObject(item));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error deleting collection images:", error);
        throw error;
    }
}

/**
 * Deletes a single inspiration image by URL
 * @param {string} imageUrl - The URL of the image to delete
 * @returns {Promise<void>}
 */
export async function deleteInspirationImage(imageUrl) {
    try {
        if (!imageUrl) {
            throw new Error("No image URL has been provided.");
        }

        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error) {
        console.error("Error deleting inspiration image:", error);
        throw error;
    }
}