'use client';

import { Box, Button, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '@/src/hooks/auth.hooks';

/**
 * LoginForm component with Google OAuth
 * Handles authentication and displays loading/error states
 */
export default function LoginForm() {
  const { signIn, isLoading, error, clearError } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          py: { xs: 4, md: 8 },
          textAlign: 'center',
        }}
      >
        {/* Logo and Title */}
        <Box sx={{ mb: 2 }}>
          <img 
            src="/friendly-eats.svg" 
            alt="Wardrobe Wiz Logo" 
            style={{ 
              width: '80px', 
              height: '80px',
              marginBottom: '16px'
            }} 
          />
          <Typography variant="h4" component="h1" sx={{ mt: 2, color: 'primary.main' }}>
            Welcome to Wardrobe Wiz
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Transform your closet into an endless source of perfectly coordinated outfits. 
            Start with just 5 photos and let our AI do the magic!
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            onClose={clearError}
            sx={{ width: '100%', mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Sign In Button */}
        <Button
          variant="contained"
          size="large"
          onClick={signIn}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            backgroundColor: 'white',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'grey.300',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: 'grey.50',
              borderColor: 'grey.400',
            },
          }}
        >
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        {/* Features List */}
        <Box sx={{ mt: 6, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            What you'll get:
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              textAlign: 'left',
            }}
          >
            {[
              'AI-powered outfit suggestions',
              'Personal digital wardrobe',
              'Smart shopping recommendations',
              'Style insights for each item',
            ].map((feature, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:before': {
                    content: '"✨"',
                    marginRight: 1,
                  },
                }}
              >
                {feature}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
