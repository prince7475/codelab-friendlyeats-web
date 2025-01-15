'use client';

import { Box, CircularProgress, Container } from '@mui/material';
import { useAuth } from '@/src/hooks/auth.hooks';
import LoginForm from '@/src/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it

export const dynamic = "force-dynamic";

/**
 * Landing page component
 * Shows login form for unauthenticated users
 * Redirects authenticated users to wardrobe
 */
export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect authenticated users to wardrobe
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/wardrobe');
    }
  }, [isAuthenticated, router]);

  console.log('isAuthenticated', isAuthenticated);
  console.log('isLoading', isLoading);
  // Show loading state
  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)', // Subtract header height
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show login form for unauthenticated users
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // This will not be rendered due to redirect
  return null;
}
