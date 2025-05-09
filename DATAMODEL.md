# Building Admin Data Model Documentation

## Database Schema

The application uses Supabase with the following main tables:

### expenses

Stores expense records with categories, amounts, and building information.

| Column           | Type          | Description                                         |
| ---------------- | ------------- | --------------------------------------------------- |
| id               | string (UUID) | Primary key                                         |
| created_at       | timestamp     | When the record was created                         |
| date_from        | timestamp     | Start date for the expense period                   |
| date_to          | timestamp     | End date for the expense period                     |
| category_name    | string        | Expense category (e.g., "Utilities", "Maintenance") |
| description      | string        | Detailed description of the expense                 |
| amount           | number        | The expense amount                                  |
| building_address | string        | Building address (redundant for better performance) |
| building_id      | string (UUID) | Foreign key to buildings table                      |
| provider_id      | string (UUID) | Optional foreign key to providers table             |

### buildings

Contains building details like addresses and contact information.

| Column  | Type          | Description                      |
| ------- | ------------- | -------------------------------- |
| id      | string (UUID) | Primary key                      |
| address | string        | Physical address of the building |

## Data Flow

### Fetching Data

1. **Client-Side Data Fetching**:

   - Components use the `fetchExpenses` helper function from `src/helpers/fetchExpenses.ts`
   - This function makes API calls to the Next.js API routes

2. **Server-Side API Routes**:

   - Located in `src/app/api/`
   - API routes communicate with Supabase to fetch and manipulate data
   - Implement caching, filtering, and error handling

3. **Data Caching**:
   - The `fetchExpenses` helper implements a basic client-side caching mechanism
   - Cached data is stored by month to reduce redundant API calls

### Data Filtering

The app supports multiple filtering mechanisms:

1. **By Month**:

   - Use the `month` parameter in `fetchExpenses` to filter by a specific month
   - Format should be "Month YYYY" (e.g., "January 2023")
   - The helper converts this to "YYYY-MM" format for the API
   - **Important**: When a month is selected in the UI, the data displayed is actually from the **previous month**
   - For example, when "March 2023" is selected, the app shows data from February 2023
   - This filtering uses the `date_from` and `date_to` fields, **not** the `created_at` field
   - Expenses are included if their date range (`date_from` to `date_to`) overlaps with the target month

2. **By Building**:

   - Use the `buildingId` parameter to filter expenses for a specific building

3. **Previous Month Comparison**:
   - Set `previousMonth: true` to include previous month's data for comparison
   - This allows the app to show month-over-month changes and trends

## Type Definitions

The app uses TypeScript interfaces to ensure type safety:

1. **Expense Interface** (`src/types/expense.ts`):

   - Defines the structure of expense objects
   - Used throughout the application to ensure consistent data handling

2. **Building Interface** (`src/types/building.ts`):

   - Defines the structure of building objects

3. **DashboardData Interface** (`src/types/expense.ts`):
   - Wrapper interface for collections of expenses

## Error Handling

The data fetching implementation includes:

1. **Fallback Data**:

   - If API requests fail, the app falls back to predefined data
   - This ensures the UI doesn't break when data cannot be fetched

2. **Detailed Logging**:
   - API calls and errors are logged to the console for debugging

## Best Practices for Working with Data

1. **Use the Provided Helpers**:

   - Always use the `fetchExpenses` helper for consistent data fetching
   - This ensures proper caching and error handling

2. **Type Safety**:

   - Always use the provided interfaces when working with data
   - This prevents type-related bugs and provides better IDE support

3. **Adding New Data Fields**:

   - Update both database schema and TypeScript interfaces
   - Update any affected components
   - Consider backward compatibility for existing data

4. **Performance Considerations**:
   - Leverage caching for frequently accessed data
   - Filter data on the server side when possible
   - Implement pagination for large datasets
