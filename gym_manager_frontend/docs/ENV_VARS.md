# Environment Variables

## Supabase (Frontend)
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY

If using Vite instead of CRA, you can alternatively set:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

The UI will show a banner if these values are not set during development.

This frontend supports both Create React App (CRA) and Vite variable prefixes for Supabase configuration.

The runtime resolution is:
- Prefer CRA variables (REACT_APP_*)
- Fall back to Vite variables (VITE_*) if CRA variables are not present
- Log a generic message indicating which prefix was detected (no secret values printed)

## Supabase Variables

Preferred (CRA):
- REACT_APP_SUPABASE_URL: The URL of your Supabase instance.
- REACT_APP_SUPABASE_ANON_KEY: The anonymous key for your Supabase project.

Alternative (Vite, only if using a Vite build):
- VITE_SUPABASE_URL: The URL of your Supabase instance.
- VITE_SUPABASE_ANON_KEY: The anonymous key for your Supabase project.

## Setup

1. Create a `.env` file in the root of `gym_manager_frontend` (same folder as its package.json).
2. Add your variables.

Example (CRA recommended):
REACT_APP_SUPABASE_URL=https://your-supabase-url.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

Alternative (Vite):
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

## Notes

- After editing `.env`, you MUST restart the dev server/preview to pick up changes.
- Do NOT log or expose actual key values anywhere; the app only logs the prefix used.
- Keep real `.env` values out of version control. Use `.env.example` as a template.
- If variables are missing, the app uses a safe no-op Supabase client to avoid runtime crashes (auth flows will be disabled).
