Supabase environment variables

Add the following keys to your .env file at the root of gym_manager_frontend (Vite):
- VITE_SUPABASE_URL=<your-supabase-project-url>
- VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

Notes:
- When these variables are missing, the app instantiates a no-op Supabase client to avoid runtime crashes.
- Authentication flows will be disabled until valid env vars are provided.

See .env.example for placeholders.
