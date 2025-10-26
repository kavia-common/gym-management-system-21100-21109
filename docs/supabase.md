# Supabase Configuration Guide

## Overview

This document explains how to configure Supabase for the Gym Manager frontend to enable:
- Email/password authentication
- Google OAuth sign-in
- Session handling and role-based routing

The frontend already integrates Supabase via the SDK and expects certain environment variables and redirect URL settings. This guide walks through creating a Supabase project, setting environment variables, enabling the Google provider, adding the OAuth redirect URL, and mapping roles in user metadata or app metadata to drive role-based access in the UI.

## Prerequisites

- A Supabase account and project
- Access to the Supabase Dashboard for your project
- Google Cloud Console access (for OAuth Client ID/Secret) if you plan to enable Google sign-in

## Environment Variables (Vite build)

The current frontend reads Supabase credentials via Vite envs:

Required:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Optional:
- VITE_SITE_URL (used for email redirect links)

Password recovery:
- Recovery emails should redirect to: `${VITE_SITE_URL}/reset-password`

Ensure Supabase Authentication -> URL Configuration has the callback URLs that match your deployment origins.

The React app reads Supabase credentials from environment variables at build/runtime (Create React App convention). These must be set for auth to function.

Required:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY

Optional (for API mocks and base URL if you wire a backend later):
- REACT_APP_API_BASE_URL
- REACT_APP_USE_MOCKS=true

Where they are used:
- src/lib/supabaseClient.js uses REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to create the client
- src/config.js surfaces the values for debugging and centralizes env access

Example .env.local (do not commit to source control):
```
REACT_APP_SUPABASE_URL=https://YOURPROJECTID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
REACT_APP_API_BASE_URL=
REACT_APP_USE_MOCKS=true
```

Notes:
- In local development, use a .env.local file at gym_manager_frontend/ root. CRA loads variables prefixed with REACT_APP_ automatically.
- If these variables are missing, the UI will show a console warning and auth will not function.

## Create and Configure a Supabase Project

1) Create a project:
- Go to Supabase Dashboard
- Create a new project and wait for initialization

2) Retrieve credentials:
- Settings > API
  - Project URL → use as REACT_APP_SUPABASE_URL
  - anon public key → use as REACT_APP_SUPABASE_ANON_KEY

3) Add environment variables to the frontend:
- In gym_manager_frontend/.env.local set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY as above
- Restart the dev server after changes

## Enable Email/Password Authentication

The app uses:
- supabase.auth.signInWithPassword for login (src/pages/auth/Login.jsx)
- supabase.auth.signUp for registration (src/pages/auth/Register.jsx)

To ensure this works:
- Dashboard > Authentication > Providers
  - Enable Email provider
  - Optionally require email confirmations
- If email confirmations are on, sign-up flow will not immediately return a session; the UI will prompt users to confirm and then sign in.

## Enable Google Provider

The app supports Google sign-in via:
- supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })

Steps:
1) Create a Google OAuth Client:
- Go to Google Cloud Console
- APIs & Services > Credentials > Create Credentials > OAuth client ID
- Application type: Web application
- Authorized JavaScript origins:
  - http://localhost:3000 (development)
  - Your deployed site origin (e.g., https://app.example.com) when ready
- Authorized redirect URIs:
  - http://localhost:3000/auth/callback
  - https://app.example.com/auth/callback (when deployed)
- Save Client ID and Client Secret

2) Configure Supabase Google provider:
- Supabase Dashboard > Authentication > Providers > Google
- Enable the provider
- Paste the Google Client ID and Client Secret

3) Configure redirect URLs in Supabase:
- Supabase Dashboard > Authentication > URL Configuration
- Add the Callback URL(s):
  - Development: http://localhost:3000/auth/callback
  - Production: https://app.example.com/auth/callback

The app constructs the redirect dynamically as:
- {SITE_URL}/auth/callback
Where {SITE_URL} is window.location.origin at runtime.

## Redirect URL

- The callback route is implemented at /auth/callback in the React app (src/pages/auth/AuthCallback.jsx).
- Set the Supabase redirect URL to:
  - {SITE_URL}/auth/callback
- In development:
  - SITE_URL = http://localhost:3000 → http://localhost:3000/auth/callback
- In production:
  - SITE_URL = your deployed origin → e.g., https://app.example.com/auth/callback

## Session and Route Handling

- On sign-in or callback, the app reads the active session via supabase.auth.getSession() or from signInWithPassword/signUp responses.
- The Redux store keeps { token, user } using authSlice reducers.
- ProtectedRoute (src/components/auth/ProtectedRoute.jsx) listens to auth state changes:
  - Bootstraps session from Supabase if Redux token is empty
  - Subscribes to onAuthStateChange to update Redux on sign-in/sign-out
- RoleGuard (src/components/auth/RoleGuard.jsx) gates routes by role

## Roles and Metadata Mapping

The app derives the user’s role from Supabase user metadata:
- Preferred order:
  1) user.app_metadata.role
  2) user.user_metadata.role
  3) default: 'member'

Where it is used:
- src/pages/auth/Login.jsx
- src/pages/auth/Register.jsx
- src/pages/auth/AuthCallback.jsx
- src/components/auth/ProtectedRoute.jsx

Strategies:
- During registration, the app stores minimal profile info in user_metadata including name and role:
  - signUp options.data = { name, role }
- You may also set an app_metadata.role via Supabase Auth hooks or RLS policies server-side for stricter control (e.g., only admins can set roles).
- Frontend role-based routing:
  - owner → /owner
  - trainer → /trainer
  - member → /member

Examples:
1) Setting role during sign-up (already implemented):
```javascript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: window.location.origin + '/auth/callback',
    data: {
      name,
      role, // 'owner' | 'trainer' | 'member'
    },
  },
});
```

2) Enforcing role server-side (optional):
- Use a Supabase Edge Function or Auth hook to validate and set app_metadata.role based on your own admin rules.
- Example pattern:
  - If email domain is '@yourgym.com', role='owner' or 'trainer'
  - Else default to 'member'
- Update auth.users app_metadata via Admin API or Postgres function triggered on INSERT into auth.users.

3) Reading role on the client (already implemented in multiple places):
```javascript
const role =
  profile?.app_metadata?.role ||
  profile?.user_metadata?.role ||
  'member';
```

Considerations:
- app_metadata is write-restricted and best for roles managed by the server. user_metadata is user-controlled and suitable for preferences or provisional role requests.
- If you choose to enforce role exclusively in app_metadata, update the frontend to ignore user_metadata.role.

## Local Development Checklist

- Install dependency in the frontend:
  - npm install @supabase/supabase-js
  - Already present in package.json

- Set environment variables (gym_manager_frontend/.env.local):
```
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
REACT_APP_USE_MOCKS=true
```
- Start the app:
  - npm start

- In Supabase Dashboard:
  - Enable Email provider
  - Enable Google provider and configure Client ID/Secret
  - Add redirect URL: http://localhost:3000/auth/callback

- Test flows:
  - Email/password sign-in: Login page
  - Registration: Register page (if email confirmation required, verify and then sign in)
  - Google sign-in: Login or Register page “Continue with Google” button

## Deployment Notes

- Add production environment variables (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY) in your hosting environment.
- Set the production redirect URL in Supabase URL Configuration: https://your-domain/auth/callback.
- Ensure Authorized JavaScript origins and redirect URIs are configured in Google Cloud Console to match your production domain.

## Troubleshooting

- Missing environment variables:
  - Console shows: “[Supabase] Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY. Auth will not function until set.”
  - Fix: verify .env.local with both variables and restart dev server.

- Callback not reached or sign-in loop:
  - Verify the exact redirect URL in Supabase settings matches {SITE_URL}/auth/callback
  - Confirm Authorized redirect URIs in Google Cloud Console include the same URL
  - Ensure the route /auth/callback is accessible in the app (it is defined in AppRoutes)

- Role routing incorrect:
  - Inspect user.app_metadata.role and user.user_metadata.role in the browser devtools (Redux state or Supabase session)
  - Adjust server-side app_metadata assignment if enforcing roles centrally

- Email confirmation required:
  - If sign-up returns no session, the user must confirm their email before signing in. The UI already informs and redirects to /login.

## References in Codebase

- Supabase client: src/lib/supabaseClient.js
- Environment config: src/config.js
- Login flow: src/pages/auth/Login.jsx
- Registration flow: src/pages/auth/Register.jsx
- OAuth callback: src/pages/auth/AuthCallback.jsx
- Auth guards:
  - src/components/auth/ProtectedRoute.jsx
  - src/components/auth/RoleGuard.jsx
- Routing (callback route and portals): src/routes/AppRoutes.jsx
