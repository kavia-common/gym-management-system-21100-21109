# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Auth Guards

- ProtectedRoute: redirects unauthenticated users to `/login`, preserving the attempted path in `state.from`.
- RoleGuard: restricts access to routes by role and redirects to the appropriate dashboard if the user lacks permission.

Login and Register pages are wired to Redux `authSlice` to store `{ token, user, role }` and navigate to dashboards by role.

When integrating a real backend you have two modes:

1) Real Supabase mode (default)
- Set the following environment variables:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
- Ensure `REACT_APP_USE_MOCKS=false` (this is the default in `.env.example`).
- The app uses Supabase services from `src/services/supabase/*` via `src/lib/supabaseClient.js`.
- API calls should go through these Supabase services rather than custom HTTP clients.

2) Mock mode (MSW)
- Toggle by setting `REACT_APP_USE_MOCKS=true`.
- On startup, `src/index.js` will dynamically import and start the MSW worker (`src/mocks/browser.js`) and register handlers from `src/mocks/handlers.js`.
- This mode does not require Supabase credentials and returns seeded in-memory data from `src/mocks/data/*`.

Notes:
- `src/index.js` guards MSW initialization and only starts it when `REACT_APP_USE_MOCKS === 'true'`.
- For real Supabase mode, provide valid Supabase env values; otherwise, the Supabase client will not be created and auth hydration is skipped.
- Legacy REST endpoints in `src/api/endpoints.js` and axios `src/api/httpClient.js` are retained for reference but new data flows should prefer Supabase services where available.

## Supabase Authentication

This app integrates Supabase email/password auth.

Environment variables (Vite):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_SITE_URL (used for email redirect links; falls back to window.location.origin)

Create a `.env` file in gym_manager_frontend with:
```
VITE_SUPABASE_URL=https://YOURPROJECTID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
VITE_SITE_URL=http://localhost:3000
```

Key files:
- src/lib/supabaseClient.js — Supabase client singleton.
- src/context/AuthContext.jsx — Session handling and actions: signUp, signIn, signOut, resetPassword, updatePassword.
- src/pages/ForgotPassword.tsx and src/pages/ResetPassword.tsx — Password recovery flow.
- src/components/auth/ProtectedRoute.jsx — Guards protected routes.
- src/routes/AppRoutes.jsx — Includes /forgot-password and /reset-password.

Routes:
- /login — Sign in
- /register — Sign up
- /forgot-password — Request reset link
- /reset-password — Set new password after recovery link
- Portals: /owner, /trainer, /member (guarded)

Invite Codes (Trainer/Admin):
- Registration for Trainer (`trainer`) and Admin/Owner (`owner`) requires an invite code.
- Configure via env: `REACT_APP_INVITE_CODES_TRAINER`, `REACT_APP_INVITE_CODES_OWNER`, or set `REACT_APP_INVITE_CODES_ALLOW_ANY=true` for local demos.
- Users can click "Request access" to submit a local request saved to `localStorage.access_requests`.

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
