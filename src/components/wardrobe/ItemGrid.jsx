'use client';

import React from 'react';
import { Box } from '@mui/material';
import ItemCard, { ItemCardSkeleton } from './SinglelItemCard';

export default function ItemGrid({ items = [], isLoading = false, onItemClick }) {
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, 1fr)', // 2 columns on mobile
      sm: 'repeat(3, 1fr)', // 3 columns on tablet
      md: 'repeat(4, 1fr)', // 4 columns on small desktop
      lg: 'repeat(5, 1fr)', // 5 columns on larger screens
    },
    gap: 2,
    px: 2,
  };

  if (isLoading) {
    return (
      <Box sx={gridStyles}>
        {[...Array(10)].map((_, index) => (
          <ItemCardSkeleton key={`skeleton-${index}`} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={gridStyles}>
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