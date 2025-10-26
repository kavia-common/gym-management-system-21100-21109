# Supabase Auth Setup (Frontend)

Environment variables required in .env:

REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>
# Optional, used for emailRedirectTo / reset flows
REACT_APP_SITE_URL=<public-site-url>

Notes:
- The Supabase client is initialized in src/lib/supabaseClient.js.
- AuthProvider (src/context/AuthContext.jsx) loads the session on mount and listens to onAuthStateChange.
- Update redirect URLs in the Supabase dashboard to match your SITE_URL.
- Routes: /login, /signup, /forgot-password, /reset-password; protected example: /dashboard.
