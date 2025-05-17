# Security Best Practices

## Environment Variables

### Setup Instructions

1. Create a `.env.local` file in the project root with the following variables:

```bash
# ⚠️ IMPORTANT: ALWAYS use placeholders here - NEVER paste real credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

2. For production, set these environment variables in your hosting platform (Vercel, Netlify, etc.)

3. **NEVER commit the `.env.local` file to version control**

4. **NEVER share real credentials in documentation, comments, chat, or code examples - not even partially**

### Secure Usage Guidelines

- **Client-side components:** Only use the `supabaseClient.tsx` for public data or authenticated operations
- **Server-side components and API routes:** Use `supabaseServer.ts` which provides better security for sensitive operations
- **Server Components:** Prefer using React Server Components when possible to keep API keys server-side

## Supabase Security

### Row Level Security (RLS)

All tables should have Row Level Security enabled with appropriate policies:

1. Enable RLS on all tables in Supabase dashboard
2. Create policies based on user roles and permissions
3. Test policies thoroughly

### Authentication

1. Use Supabase Auth for user authentication
2. Implement proper session management
3. Add authentication middleware for protected routes

## API Security

### Best Practices

1. API routes should validate input thoroughly
2. Use CSRF protection for mutations
3. Implement rate limiting
4. Restrict CORS to specific domains
5. Use HTTPS for all connections

### Error Handling

1. Use generic error messages for clients
2. Log detailed errors server-side
3. Never expose database details or stack traces to clients

## Regular Audits

1. Regularly review API endpoints for security issues
2. Check for hardcoded credentials in the codebase
3. Ensure environment variables are properly configured in all environments
4. Update dependencies regularly to patch security vulnerabilities
