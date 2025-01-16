'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/src/lib/getUser';
import { 
    uploadWardrobeImage, 
    deleteWardrobeImage 
} from '@/src/lib/firebase/storage';
import { 
    addWardrobeItem, 
    getWardrobeItems, 
    getWardrobeItemsSnapshot,
    deleteWardrobeItem,
    updateWardrobeItem,
    generateItemMetadata
} from '@/src/lib/firebase/wardrobe.firestore';

/**
 * Hook to manage wardrobe items with real-time updates
 */
export function useWardrobeItems() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useUser();

    useEffect(() => {
        if (!user?.uid) {
            setItems([]);
            setIsLoading(false);
            return;
        }

        let unsubscribe;
        try {
            // Set up real-time listener
            unsubscribe = getWardrobeItemsSnapshot(user.uid, (newItems) => {
                setItems(newItems);
                setIsLoading(false);
            });
        } catch (err) {
            console.error('Error setting up wardrobe items listener:', err);
            setError(err.message);
            setIsLoading(false);
        }

        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user?.uid]);

    return {
        items,
        isLoading,
        error,
    };
}

/**
 * Hook to handle item upload process
 */
export function useUploadItem() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const user = useUser();

    const uploadItem = async (file) => {
        if (!user?.uid) {
            setError('You must be logged in to upload items');
            return null;
        }

        if (!file) {
            setError('No file selected');
            return null;
        }

        try {
            setIsUploading(true);
            setError(null);

            // First analyze the image
            const metadata = await generateItemMetadata(file);

            // If analysis passes, proceed with upload
            const imageUrl = await uploadWardrobeImage(user.uid, file);

            // Create wardrobe item with metadata
            const newItem = await addWardrobeItem(user.uid, imageUrl, metadata);

            return newItem;
        } catch (err) {
            console.error('Error uploading item:', err);
            setError('Failed to upload item');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const resetError = () => setError(null);

    return {
        uploadItem,
        isUploading,
        error,
        resetError,
    };
}

/**
 * Hook to handle wardrobe item deletion
 */
export function useDeleteWardrobeItem() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const user = useUser();

    const deleteItem = async (itemId) => {
        if (!user?.uid) {
            setError('User must be logged in to delete items');
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            // Delete from Firestore first to get the image URL
            const deletedItem = await deleteWardrobeItem(user.uid, itemId);
            
            // Then delete the image from storage
            if (deletedItem.imageUrl) {
                await deleteWardrobeImage(deletedItem.imageUrl);
            }
        } catch (err) {
            console.error('Error deleting wardrobe item:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deleteItem,
        isDeleting,
        error
    };
}