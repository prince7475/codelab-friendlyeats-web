'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/src/lib/getUser';
import { uploadInspirationImage } from '@/src/lib/firebase/storage';
import {
    generateOutfit,
    getUserOutfits,
    getUserOutfitsSnapshot
} from '@/src/lib/firebase/outfitGenerator.firestore';

/**
 * Hook to handle outfit generation process
 */
export function useGenerateOutfit() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const user = useUser();

    const generate = async (description, inspirationImage) => {
        if (!user?.uid) {
            setError('You must be logged in to generate outfits');
            return null;
        }

        try {
            setIsGenerating(true);
            setError(null);

            let imageUrl = null;
            if (inspirationImage) {
                // Upload inspiration image if provided
                imageUrl = await uploadInspirationImage(user.uid, inspirationImage);
            }

            // Generate and save the outfit
            const generatedOutfit = await generateOutfit(
                user.uid,
                description,
                inspirationImage
            );

            return generatedOutfit;
        } catch (err) {
            console.error('Error generating outfit:', err);
            setError('Failed to generate outfit');
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        generate,
        isGenerating,
        error,
    };
}

/**
 * Hook to manage user's outfits with real-time updates
 */
export function useUserOutfits() {
    const [outfits, setOutfits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useUser();

    useEffect(() => {
        if (!user?.uid) {
            setOutfits([]);
            setIsLoading(false);
            return;
        }

        let unsubscribe;
        try {
            // Set up real-time listener
            unsubscribe = getUserOutfitsSnapshot(user.uid, (newOutfits) => {
                setOutfits(newOutfits);
                setIsLoading(false);
            });
        } catch (err) {
            console.error('Error setting up outfits listener:', err);
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
        outfits,
        isLoading,
        error,
    };
}
