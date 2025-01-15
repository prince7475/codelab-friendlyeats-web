import { WARDROBE_CATEGORIES } from '../constants/wardrobe';

/**
 * Firestore schema for wardrobe items
 * @typedef {Object} WardrobeItem
 * @property {string} id - Unique identifier for the item
 * @property {string} userId - User ID who owns the item
 * @property {string} imageUrl - URL to the full-size image in storage
 * @property {string} thumbnailUrl - URL to the thumbnail image in storage
 * @property {string} name - Name of the item
 * @property {string} description - Description of the item
 * @property {WARDROBE_CATEGORIES} category - Category of the item
 * @property {Date} createdAt - Timestamp when the item was created
 */

/**
 * Collection names in Firestore
 * @readonly
 * @enum {string}
 */
export const COLLECTIONS = {
  WARDROBE_ITEMS: 'wardrobe_items',
  USERS: 'users',
};

/**
 * Default values for new wardrobe items
 */
export const DEFAULT_WARDROBE_ITEM = {
  name: '',
  description: '',
  category: WARDROBE_CATEGORIES.OTHERS,
  createdAt: new Date(),
};
