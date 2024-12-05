// By using TypeScript, you can ensure you don't accidentally pass the wrong data format to your components or database, like passing a string instead of a number to invoice amount. This can help catch bugs early in the development process.

// Declares a TypeScript interface to represent the structure of an expense object as stored in the expense table.
export interface Expense {
  id: number;
  created_at: string | null;
  category_name: string;
  description: string;
  amount: number;
  colour: string;
  building_address: string;
  building_id: string;
}

// Define the combined data type, an array of Expense objects. expenses: [{},{}]
export interface DashboardData {
  expenses: Expense[];
}
