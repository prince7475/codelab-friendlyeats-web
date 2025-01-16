'use client';

import React from 'react';
import { Stack } from '@mui/material';
import OutfitCard from './OutfitCard';

export default function OutfitList({ outfits }) {
  return (
    <Stack spacing={3}>
      {outfits.map((outfit) => (
        <OutfitCard key={outfit.id} outfit={outfit} />
      ))}
    </Stack>
  );
}
