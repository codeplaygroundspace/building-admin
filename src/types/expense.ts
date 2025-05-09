/**
 * Expense Type Definitions
 *
 * This file defines the TypeScript interfaces for expense-related data structures
 * used throughout the application. These interfaces ensure type safety and
 * prevent common errors when working with expense data.
 */

// By using TypeScript, you can ensure you don't accidentally pass the wrong data format to your components or database, like passing a string instead of a number to invoice amount. This can help catch bugs early in the development process.

/**
 * Expense Interface
 *
 * Represents a single expense record as returned by the API.
 * Note: Some fields are computed/transformed by the API
 * and don't directly exist in the database table.
 */
export interface Expense {
  id: string; // Unique identifier (UUID)
  created_at: string | null; // When the record was created in ISO format
  date_from?: string | null; // Optional start date of the expense period
  date_to?: string | null; // Optional end date of the expense period
  provider_name: string; // Name of the provider from the providers table
  description: string; // Detailed description of the expense
  amount: number; // Monetary amount of the expense
  building_address: string; // Human-readable building address (from buildings table)
  building_id: string; // Reference to the building (UUID)
  provider_id?: string; // Reference to the service provider (UUID)
  provider_category: string; // Category of the service provider
}

/**
 * DashboardData Interface
 *
 * A wrapper interface that contains an array of Expense objects.
 * This is typically the response format from API endpoints.
 * Used for presenting expenses on dashboard components.
 */
export interface DashboardData {
  expenses: Expense[];
}
