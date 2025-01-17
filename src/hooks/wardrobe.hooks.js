'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/src/lib/getUser';
import { 
    uploadWardrobeImage, 
    deleteWardrobeImage 
} from '@/src/lib/firebase/storage';
import { 
    addWardrobeItem, 
    deleteWardrobeItem, 
    generateItemMetadata,
    getWardrobeItemsSnapshot
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
 * Hook to handle multiple items upload process
 */
export function useUploadMultipleItems() {
    const user = useUser();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState({});

    const resetError = () => setError(null);

    const uploadItems = async (files) => {
        if (!user?.uid) {
            setError('You must be logged in to upload items');
            return null;
        }

        if (!files || files.length === 0) {
            setError('No files selected');
            return null;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Process files in parallel with Promise.all
            const uploadPromises = Array.from(files).map(async (file, index) => {
                try {
                    // Initialize progress for this file
                    setProgress(prev => ({
                        ...prev,
                        [file.name]: 0
                    }));

                    const metadata = await generateItemMetadata(file);

                    // Upload the image first
                    const imageUrl = await uploadWardrobeImage(user.uid, file, (progress) => {
                        setProgress(prev => ({
                            ...prev,
                            [file.name]: Math.round(progress * 50) // First 50% is upload
                        }));
                    });

                    // Generate metadata using Gemini AI
                    setProgress(prev => ({
                        ...prev,
                        [file.name]: 75 // 75% when starting AI analysis
                    }));


                    // Create wardrobe item with AI-generated metadata
                    const itemData = {
                        userId: user.uid,
                        imageUrl,
                        name: metadata.name,
                        description: metadata.description,
                        category: metadata.category,
                        colors: metadata.colors,
                        styles: metadata.styles,
                        occasions: metadata.occasions,
                        confidenceScore: metadata.confidenceScore,
                        isWearable: metadata.isWearable
                    };

                    // Update progress to show completion of metadata generation
                    setProgress(prev => ({
                        ...prev,
                        [file.name]: 90
                    }));

                    // Add to Firestore
                    const result = await addWardrobeItem(itemData);

                    // Update progress to show completion
                    setProgress(prev => ({
                        ...prev,
                        [file.name]: 100
                    }));

                    return result;
                } catch (err) {
                    console.error(`Error uploading file ${file.name}:`, err);
                    // Update progress to show error
                    setProgress(prev => ({
                        ...prev,
                        [file.name]: -1 // Use negative value to indicate error
                    }));
                    throw err;
                }
            });

            const results = await Promise.all(uploadPromises);
            return results.filter(Boolean); // Filter out any failed uploads
        } catch (err) {
            setError('Failed to upload one or more items');
            return null;
        } finally {
            setIsUploading(false);
            // Clear progress after a delay
            setTimeout(() => setProgress({}), 2000);
        }
    };

    return {
        uploadItems,
        isUploading,
        error,
        resetError,
        progress
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