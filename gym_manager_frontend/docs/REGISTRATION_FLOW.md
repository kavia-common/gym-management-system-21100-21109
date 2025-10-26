# Registration Flow with Role Selection

This document describes the Role Selection step and how the registration wizard consumes the selected role.

## Routes

- GET /get-started: Role selection screen where a user chooses one of:
  - Member (`member`)
  - Trainer (`trainer`)
  - Admin/Owner (`owner`)
- GET /register: Existing registration entry page
- GET /register/wizard: Existing registration wizard

The new `/get-started` route is registered in `src/routes/AppRoutes.jsx`.

## State and Persistence

A lightweight hook `useRegistrationStore` is available in `src/state/useRegistrationStore.js`.

- LocalStorage key: `registration.role`
- API:
  - `useRegistrationStore()` returns `{ role, setRole, clearRole, STORAGE_KEY }`
  - `getStoredRegistrationRole()` returns the stored role string or `null`
- Behavior:
  - Calling `setRole(value)` persists `value` to localStorage
  - `clearRole()` removes the role entry

This avoids impacting the existing Supabase authentication context and works even without a global state lib.

## RoleSelect Page

- File: `src/pages/auth/RoleSelect.jsx`
- Function:
  - Presents three accessible cards with icons and descriptions
  - On selection, saves the role using `useRegistrationStore().setRole(role)`
  - Navigates to `/register`
- Accessibility:
  - Keyboard focus rings on interactive elements
  - Buttons have appropriate aria-labels
  - Structure uses landmark/section semantics

## Registration Wizard Enhancements

- File: `src/components/membership/RegistrationWizard.jsx`
- Reads the selected role via `getStoredRegistrationRole()` once on mount (defaults to `member`).
- Displays:
  - A small role "chip" next to the Registration title
  - Role-specific subtitle text to set expectations
  - A "Change" link that routes back to `/get-started`
- Placeholders are included for future role-specific field variations.

## Header Updates

- File: `src/components/layout/Header.jsx`
- Adds a "Get Started" link in the main nav
- Updates the primary CTA button to route to `/get-started` ensuring users land on role selection first.

## Styling

- Ocean Professional theme guidelines:
  - Primary: `#2563EB` (used on CTAs, focus rings, and chips)
  - Subtle gradients and rounded corners on cards
  - Accessible contrast for text
- Uses the existing Tailwind-style utility classes and `styles/theme.css`.

## Notes

- No changes were made to the Supabase AuthProvider. Existing auth remains intact.
- If future global state is introduced (e.g., Zustand), `useRegistrationStore` can be refactored to that store while preserving the localStorage API for backward compatibility.
