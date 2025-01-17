'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function getConfidenceColor(score) {
  if (score >= 0.8) return '#4caf50'; // green
  if (score >= 0.6) return '#ffc107'; // yellow
  return '#f44336'; // red
}

export default function OutfitDetailsModal({ open, onClose, outfit }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    title,
    items = [],
    description,
    confidenceScore,
    explanation,
  } = outfit;

  const confidenceColor = getConfidenceColor(confidenceScore);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Chip
            label={`${Math.round(confidenceScore * 100)}% Match`}
            size="small"
            sx={{
              mt: 1,
              backgroundColor: confidenceColor,
              color: '#fff',
              fontWeight: 'medium',
            }}
          />
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Items Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    paddingTop: '100%',
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[2],
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {item.reason}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Occasion
          </Typography>
          <Typography variant="body1" paragraph>
            {description}
          </Typography>
        </Box>

        {/* Explanation */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Styling Notes
          </Typography>
          <Typography variant="body1">
            {explanation}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
