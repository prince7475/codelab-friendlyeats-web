'use client';

import React from 'react';
import { 
  Grid, 
  Box, 
  CircularProgress, 
  Typography,
  Container
} from '@mui/material';
import OutfitCard from './OutfitCard';

export default function OutfitList({ outfits = [], isLoading = false }) {
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!outfits || outfits.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight={400}
        textAlign="center"
        px={2}
      >
        <Typography variant="h6" gutterBottom>
          Get personalized outfit suggestions based on your wardrobe.
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Perfect for any occasion!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2 }}>
      {outfits.map((outfit) => (
        <Grid item xs={1} key={outfit.id}>
          <OutfitCard outfit={outfit} />
        </Grid>
      ))}
    </Grid>
  );
}
