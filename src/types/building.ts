/**
 * Building Type Definitions
 *
 * This file defines the TypeScript interfaces for building-related data structures
 * used throughout the application. These interfaces ensure type safety and
 * consistency when working with building data.
 */

/**
 * Building Interface
 *
 * Represents a single building record as stored in the Supabase database.
 * This interface is used for displaying, filtering, and referencing buildings.
 */
export interface Building {
  id: string; // Unique identifier (UUID)
  address: string; // Physical address of the building
}
