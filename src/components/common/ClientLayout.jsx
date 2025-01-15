'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/src/styles/theme';
import Header from './Header';

export default function ClientLayout({ children, user }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header initialUser={user} />
      <main style={{ 
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 64px)' 
      }}>
        {children}
      </main>
    </ThemeProvider>
  );
}
