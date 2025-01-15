'use client';

import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Checkroom as CheckroomIcon,
  Style as StyleIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/auth.hooks';
import { usePathname } from 'next/navigation';

const navItems = [
  { text: 'My Wardrobe', href: '/wardrobe', icon: <CheckroomIcon /> },
  { text: 'Outfit Generator', href: '/outfits', icon: <StyleIcon /> },
  { text: 'Shopping List', href: '/shopping', icon: <ShoppingBagIcon /> },
];

/**
 * Header component with responsive design and user profile
 */
export default function Header() {
  const pathname = usePathname();
  const { user, signOut, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    signOut();
  };

  // Mobile drawer content
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main' }}>
        Wardrobe Wiz
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            href={item.href}
            selected={pathname === item.href}
            sx={{
              color: pathname === item.href ? 'primary.main' : 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: pathname === item.href ? 'primary.main' : 'text.primary' 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <img 
              src="/friendly-eats.svg" 
              alt="Wardrobe Wiz Logo" 
              style={{ width: '32px', height: '32px' }} 
            />
            Wardrobe Wiz
          </Typography>

          {isAuthenticated ? (
            <>
              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, mr: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    href={item.href}
                    startIcon={item.icon}
                    sx={{
                      color: pathname === item.href ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              {/* User Profile */}
              <IconButton
                onClick={handleProfileMenu}
                size="small"
                sx={{ ml: 2 }}
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <Avatar
                  alt={user?.displayName}
                  src={user?.photoURL}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user?.displayName}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : null}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
