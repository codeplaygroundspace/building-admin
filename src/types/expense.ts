// By using TypeScript, you can ensure you don't accidentally pass the wrong data format to your components or database, like passing a string instead of a number to invoice amount. This can help catch bugs early in the development process.

// Declares a TypeScript interface to represent the structure of an expense object as stored in the expense table.
export interface Expense {
  id: string;
  created_at: string | null;
  date_from?: string | null;
  date_to?: string | null;
  category_name: string;
  description: string;
  amount: number;
  building_address: string;
  building_id: string;
  provider_id?: string;
}

// Define the combined data type, an array of Expense objects. expenses: [{},{}]
export interface DashboardData {
  expenses: Expense[];
}
