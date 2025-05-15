/**
 * Project Type Definitions
 *
 * This file defines the TypeScript interfaces for project-related data structures
 * used throughout the application. These interfaces ensure type safety and
 * prevent common errors when working with project data.
 */

/**
 * Base Project Item Interface
 *
 * Base interface for project form data before submission to the API.
 * Note that cost is a string in form context but converted to number when sent to API.
 */
export interface ProjectItem {
  id: string;
  description: string;
  cost: string;
  status?: boolean;
  provider_id: string;
  provider_name: string;
  provider_category: string;
}

/**
 * Base Fetched Project Interface
 *
 * Represents the common structure of a project record as returned by the API.
 */
export interface FetchedProject {
  id: string | number;
  created_at: string | null;
  description: string;
  cost: number;
  status: boolean | null;
  provider_id: string | null;
  provider_name: string;
  provider_category: string;
}

/**
 * Sort Configuration Type
 *
 * Generic type for sorting configuration, can be used with any data type.
 */
export type SortConfig<T> = {
  key: keyof T | null;
  direction: "ascending" | "descending";
};
