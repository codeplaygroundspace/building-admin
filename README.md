## Getting Started

- Problem: Compatibiliy issues with React 19 and supabase
- Solution: Downgrade to React 18

- Problem: It's annoying to wait a second every time I navigate to a new page
- Solution: Need to fetch data in higher-order component (HOC) such as layout.js and use Next.js 15's built-in caching capabilities so the data only loads once.
- A context in React is a mechanism that allows you to share data across the component tree without having to pass props manually at every level. It is especially useful for managing "global" data that many components in your application need access to, such as authentication state, themes, or, in your case, shared fetched data.
- Tutorial: https://www.youtube.com/watch?v=HYKDUF8X3qI
- Limitations: When the value of a Context.Provider changes, all components consuming that context will re-render, even if some components don’t rely on the updated data. This can lead to unnecessary re-renders and affect performance.
- Final decision: go without React context API. Fetch the data and pass it down as a prop to its children.

- Problem: I have added my async function to layout.tsx, however there is an error. Prevent client components from being async functions. See: https://nextjs.org/docs/messages/no-async-client-component. The error occurs because client components in Next.js cannot be asynchronous functions. The layout.tsx is by default a server component, and it should handle async operations (like fetch) correctly. However, when server-side data fetching is needed in the layout, the async function should not directly apply to the layout component.
- Solution: utlis/dataFetcher file created to remove code from layout.tsx.
- Learning: rename and move dataFetcher. hooks/useDataFetcher.tsx, this is how custom hooks shows be named.

- New problem: If the data is correctly logged in layout.tsx but not appearing in the Apartments component, it suggests that the data is not being passed down correctly or that there is an issue with how the Apartments component is set up to receive and render that data.

## Database design

- expenses table
- expenses_categories table -> connected to expenses
- buildings table -> connected to expenses

## Tech stack

- Nextjs with TypeScript
- Deploy in Vercel
- Database in Supabase
- Shadcn and Tailwind for styling
