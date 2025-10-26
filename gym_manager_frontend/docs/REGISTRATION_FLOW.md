# Registration Flow with Role Selection

This document describes the improved Get Started role selection UI and how the registration wizard consumes the selected role.

## Visual and UX Improvements (Get Started)

- Modern card-based layout with Ocean Professional styling (blue primary, amber accents, soft gradient headers, rounded corners, subtle shadows).
- Accessible heading hierarchy, ARIA labels, keyboard navigable tiles, and clear focus outlines.
- Helpful copy: concise role descriptions, “What’s included” permissions preview, and post‑signup destination note.
- Info popover per role with additional context; smooth hover/focus states.
- Subtle banner reminding users that Trainer and Admin/Owner require invite codes.
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop).

Screenshots (placeholders):
- docs/images/get-started-mobile.png
- docs/images/get-started-desktop.png

## Routes

- GET /get-started: Role selection screen (Member `member`, Trainer `trainer`, Admin/Owner `owner`)
- GET /register: Registration entry
- GET /register/wizard: Registration wizard

The `/get-started` route is registered in `src/routes/AppRoutes.jsx`.

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
  - Offers a preview of key permissions and post‑signup destination per role
  - Shows a banner about invite code requirements for Trainer/Admin/Owner (no backend change)
  - On selection, saves the role using `useRegistrationStore().setRole(role)` and routes to `/register`
- Accessibility:
  - Keyboard focus rings on all interactive elements
  - Buttons have appropriate aria-labels
  - Uses landmark and section semantics
  - Screen-reader friendly details via role="note" and role="dialog" for non-modal info

## Registration Wizard

- File: `src/components/membership/RegistrationWizard.jsx`
- Reads the selected role via `getStoredRegistrationRole()` once on mount (defaults to `member`).
- Displays:
  - A small role “chip” next to the Registration title
  - Role-specific subtitle text
  - A “Change” link that routes back to `/get-started`
- Placeholders exist for future role-specific variations.

### Invite Code (Trainer/Admin/Owner only)

- The wizard inserts an “Invite Code” step for `trainer` and `owner`.
- Users cannot proceed without a valid code.
- Validation placeholder:
  - Compares against comma-separated env vars:
    - `REACT_APP_INVITE_CODES_TRAINER`
    - `REACT_APP_INVITE_CODES_OWNER`
    - `REACT_APP_INVITE_CODES_ALLOW_ANY` (if `true`, any non-empty code passes)
  - Defaults accept demo codes: `DEMO-TRAINER` and `DEMO-OWNER`.
- If the user lacks a code, they can click “Request access” to open a modal.

## Styling

- Ocean Professional theme guidelines:
  - Primary: `#2563EB`
  - Secondary/Amber accents: `#F59E0B`
  - Soft gradient headers and subtle shadows
  - Accessible contrast for text
- Uses the existing utility classes and `styles/theme.css`. No new dependencies added.

## Notes

- Role selection still persists to localStorage and navigates to `/register`.
- No changes were made to the Supabase AuthProvider. Existing auth remains intact.
- If a global state library is introduced later, keep the localStorage API to preserve behavior.
