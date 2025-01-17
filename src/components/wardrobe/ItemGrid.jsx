'use client';

import React from 'react';
import { Box } from '@mui/material';
import ItemCard, { ItemCardSkeleton } from './SinglelItemCard';

export default function ItemGrid({ items = [], isLoading = false, onItemClick }) {
  console.log("isLoading", isLoading);
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 3,
          px: 2
        }}
      >
        {[...Array(10)].map((_, index) => (
          <ItemCardSkeleton key={`skeleton-${index}`} />
        ))}
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 3,
        px: 2
      }}
    >
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={() => onItemClick?.(item)}
        />
      ))}
    </Box>
  );
}