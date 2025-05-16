/**
 * Expense Type Definitions
 *
 * This file defines the TypeScript interfaces for expense-related data structures
 * used throughout the application. These interfaces ensure type safety and
 * prevent common errors when working with expense data.
 */

/**
 * Provider Interface
 *
 * Represents a service provider that can be associated with expenses.
 */
export interface Provider {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
}

/**
 * Base Expense Item Interface
 *
 * Base interface for expense form data before submission to the API.
 * Note that amount is a string in form context but converted to number when sent to API.
 */
export interface BaseExpenseItem {
  id: string;
  description: string;
  amount: string;
  provider_id: string;
  provider_name: string;
  provider_category: string;
  expense_reporting_month: string;
}

/**
 * Regular Expense Item
 *
 * For common/regular building expenses.
 */
export type ExpenseItem = BaseExpenseItem;

/**
 * Project Expense Item
 *
 * For project-specific expenses.
 */
export type ProjectExpenseItem = BaseExpenseItem;

/**
 * Base Fetched Expense Interface
 *
 * Represents the common structure of an expense record as returned by the API.
 * Note: Some fields are computed/transformed by the API
 * and don't directly exist in the database table.
 */
export interface BaseFetchedExpense {
  id: string; // Unique identifier (UUID)
  created_at: string | null; // When the record was created in ISO format
  expense_reporting_month: string; // Format: YYYY-MM for the month this expense should be reported in
  provider_name: string; // Name of the provider from the providers table
  description: string; // Detailed description of the expense
  amount: number; // Monetary amount of the expense
  building_address?: string; // Human-readable building address (from buildings table)
  building_id: string; // Reference to the building (UUID)
  provider_id?: string; // Reference to the service provider (UUID)
  provider_category: string; // Category of the service provider
}

/**
 * Expense Interface
 *
 * Main expense interface used throughout the application.
 * This is the standard expense format for most components.
 */
export type Expense = BaseFetchedExpense;

/**
 * Regular Fetched Expense
 *
 * Represents a regular expense record as returned by the API.
 */
export type FetchedExpense = BaseFetchedExpense;

/**
 * Project Fetched Expense
 *
 * Represents a project-specific expense record as returned by the API.
 * Can be extended with project-specific fields if needed.
 */
export type FetchedProjectExpense = BaseFetchedExpense;

/**
 * DashboardData Interface
 *
 * A wrapper interface that contains an array of Expense objects.
 * This is typically the response format from API endpoints.
 * Used for presenting expenses on dashboard components.
 */
export interface DashboardData {
  expenses: Expense[];
  months?: string[]; // Optional months array for dropdown data
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
