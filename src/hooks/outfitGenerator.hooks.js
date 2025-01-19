'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/src/lib/getUser';
import {
    createOutfitCollection,
    getOutfitCollections,
    getOutfitCollectionsSnapshot,
    updateOutfitCollection,
    deleteOutfitCollection,
    addOutfitToCollection,
} from '@/src/lib/firebase/outfitGenerator.firestore';

/**
 * Hook to manage outfit collections with real-time updates
 */
export function useOutfitCollections() {
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useUser();

    useEffect(() => {
        if (!user?.uid) {
            setCollections([]);
            setIsLoading(false);
            return;
        }

        let unsubscribe;
        try {
            // Set up real-time listener
            unsubscribe = getOutfitCollectionsSnapshot(user.uid, (newCollections) => {
                setCollections(newCollections);
                setIsLoading(false);
            });
        } catch (err) {
            console.error('Error setting up outfit collections listener:', err);
            setError(err.message);
            setIsLoading(false);
        }

        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    return { collections, isLoading, error };
}

/**
 * Hook to manage outfit collection creation
 */
export function useCreateCollection() {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const user = useUser();

    const createCollection = useCallback(async (collectionData) => {
        if (!user?.uid) {
            throw new Error('User must be logged in to create a collection');
        }
        
        setIsCreating(true);
        setError(null);

        try {
            const collectionId = await createOutfitCollection(user.uid, {
                prompt: collectionData.prompt || '',
            });
            return collectionId;
        } catch (err) {
            console.error('Error creating collection:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsCreating(false);
        }
    }, [user]);

    return { createCollection, isCreating, error };
}

/**
 * Hook to manage outfit collection deletion
 */
export function useDeleteCollection() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const user = useUser();

    const deleteCollection = useCallback(async (collectionId) => {
        if (!user?.uid) {
            throw new Error('User must be logged in to delete a collection');
        }

        setIsDeleting(true);
        setError(null);

        try {
            await deleteOutfitCollection(user.uid, collectionId);
        } catch (err) {
            console.error('Error deleting collection:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsDeleting(false);
        }
    }, [user]);

    return { deleteCollection, isDeleting, error };
}

/**
 * Hook to manage outfit generation for a collection
 */
export function useGenerateOutfitForCollection() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const user = useUser();

    const generateOutfit = useCallback(async (collectionId, outfitData) => {
        if (!user?.uid) {
            throw new Error('User must be logged in to generate an outfit');
        }

        setIsGenerating(true);
        setError(null);

        try {
            // TODO: Implement actual outfit generation logic
            // For now, just add the outfit data to the collection
            await addOutfitToCollection(user.uid, collectionId, outfitData);
        } catch (err) {
            console.error('Error generating outfit:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsGenerating(false);
        }
    }, [user]);

    return { generateOutfit, isGenerating, error };
}

/**
 * Hook to manage outfit deletion from a collection
 */
export function useDeleteOutfitFromCollection() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const user = useUser();

    const deleteOutfit = useCallback(async (collectionId, outfitId) => {
        if (!user?.uid) {
            throw new Error('User must be logged in to delete an outfit');
        }

        setIsDeleting(true);
        setError(null);

        try {
            const collection = await getOutfitCollections(user.uid);
            const updatedOutfits = collection.outfits.filter(outfit => outfit.id !== outfitId);
            await updateOutfitCollection(user.uid, collectionId, { outfits: updatedOutfits });
        } catch (err) {
            console.error('Error deleting outfit:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsDeleting(false);
        }
    }, [user]);

    return { deleteOutfit, isDeleting, error };
}