// ==========================================
// studio-eramtv/schemaTypes/index.ts
// Updated to include book type

// Import localized schemas for posts
import { localizedPostType } from './localizedPostType'
import { localizedCategoryType, localizedTagType, localizedRegionType, localizedTopicType } from './localizedSchemas'

// Import book type
import { bookType } from './bookType'
import aboutTypes from './aboutTypes'

// Export all schema types
export const schemaTypes = [
  // Post-related schemas (localized)
  localizedCategoryType, 
  localizedTagType, 
  localizedRegionType, 
  localizedTopicType, 
  localizedPostType,
  aboutTypes,

  
  // Book schema (simple)
  bookType
]

// Note: This includes:
// - Localized post system (postType -> localizedPostType)
// - Localized categories, tags, regions, topics
// - Simple book management system (bookType)