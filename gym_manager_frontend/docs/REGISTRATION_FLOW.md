# Registration & Plans UI

This frontend adds:
- /plans: Public plan comparison page using Ocean Professional styling.
- /register: Multi-step Registration Wizard with steps:
  1) Account (email/password, skipped if already logged in via Supabase)
  2) Personal details
  3) Plan selection & comparison
  4) Review (with terms acceptance)
  5) Payment setup (placeholder for Stripe integration)

Key behaviors:
- Prefill/skip Account step if user session exists via AuthProvider (Supabase).
- Persist in-progress state in localStorage under `registration_wizard_state_v1`.
- Accessible UI with clear validation and error messages.
- Responsive grid for plan cards and comparison.

Environment variables:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (optional; used for emailRedirectTo during signup)

Integrations placeholders:
- Payment setup step includes a placeholder button simulating completion. Stripe integration should be added later.

Components:
- components/membership/PlanCard.jsx
- components/membership/PlanComparison.jsx
- components/membership/RegistrationWizard.jsx

Pages:
- pages/marketing/Plans.jsx
- pages/auth/RegisterWizard.jsx

Routing:
- /plans under MainLayout
- /register under AuthLayout

Styling:
- Uses Ocean Professional palette and subtle gradients; uses sr-only class in App.css for accessibility.
