import React, { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationStore } from '../../state/useRegistrationStore';
import '../../styles/theme.css';

/**
 * Role option configuration with concise descriptions and icon hints.
 * Icons use emoji to avoid extra deps while remaining accessible.
 */
const ROLE_OPTIONS = [
  {
    label: 'Member',
    value: 'member',
    description:
      'Book classes, manage your schedule, and track your progress in your personal portal.',
    icon: '🧘',
    aria: 'Select Member role',
    permissions: ['View/book classes', 'Manage profile', 'View payments'],
    destination: 'Member dashboard',
    highlight: 'Best for gym-goers',
  },
  {
    label: 'Trainer',
    value: 'trainer',
    description:
      'Create and manage classes, view assigned members, and track attendance.',
    icon: '🏋️‍♀️',
    aria: 'Select Trainer role',
    permissions: ['Create classes', 'Manage clients', 'Track attendance'],
    destination: 'Trainer dashboard',
    requiresInvite: true,
    highlight: 'For staff trainers',
  },
  {
    label: 'Admin/Owner',
    value: 'owner',
    description:
      'Oversee memberships, payments, analytics, and staff operations.',
    icon: '🗂️',
    aria: 'Select Admin or Owner role',
    permissions: ['Manage gym', 'Financials & analytics', 'Staff settings'],
    destination: 'Owner dashboard',
    requiresInvite: true,
    highlight: 'For gym owners',
  },
];

/**
 * PUBLIC_INTERFACE
 * RoleSelect
 * Accessible role selection screen for registration onboarding.
 * On selection, persists role to localStorage via useRegistrationStore and routes to /register.
 * - Ocean Professional styling: blue primary, amber accents, soft gradient, rounded corners, subtle shadows.
 * - Accessibility: proper headings, focus outlines, ARIA labels, keyboard navigable tiles.
 */
export default function RoleSelect() {
  const navigate = useNavigate();
  const { setRole } = useRegistrationStore();

  // Local tooltip/info popover state
  const [infoIndex, setInfoIndex] = useState(null);
  const sectionId = useId();

  const handleSelect = (value) => {
    setRole(value);
    navigate('/register');
  };

  return (
    <main
      className="min-h-screen"
      aria-labelledby="get-started-title"
      style={{
        background: 'var(--color-bg)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page header */}
        <header className="text-center mb-6">
          <h1
            id="get-started-title"
            className="text-3xl md:text-4xl font-extrabold"
            style={{ color: 'var(--color-text)' }}
          >
            Get started
          </h1>
          <p
            className="mt-3 text-base md:text-lg"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Choose the role that fits how you’ll use the platform. You can go back and change this during registration.
          </p>
        </header>

        {/* Invite code note banner */}
        <div
          className="u-surface u-gradient-soft"
          role="note"
          aria-label="Invite code notice"
          style={{
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
            borderColor: 'rgba(245, 158, 11, 0.35)',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 18 }}>🔐</span>
          <p style={{ margin: 0, color: 'var(--color-text)' }}>
            Trainer and Admin/Owner roles require an invite code during registration. If you don’t have one, select Member or request access later.
          </p>
        </div>

        {/* Roles grid */}
        <section
          id={sectionId}
          aria-label="Role options"
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          }}
        >
          <style>
            {`
            @media (min-width: 720px) {
              #${sectionId} { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
            @media (min-width: 1024px) {
              #${sectionId} { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            }
            `}
          </style>

          {ROLE_OPTIONS.map((opt, idx) => (
            <article
              key={opt.value}
              role="group"
              aria-roledescription="Selectable card"
              aria-label={`${opt.label} role`}
              className="card"
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                overflow: 'hidden',
              }}
              onMouseLeave={() => setInfoIndex((v) => (v === idx ? null : v))}
            >
              {/* Tile header */}
              <div
                className="u-gradient-soft"
                style={{
                  padding: '20px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 64,
                    width: 64,
                    margin: '0 auto',
                    borderRadius: 9999,
                    background:
                      'linear-gradient(180deg, rgba(37,99,235,0.12) 0%, rgba(249,250,251,1) 100%)',
                    boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.15)',
                    fontSize: 28,
                  }}
                >
                  <span aria-hidden="true">{opt.icon}</span>
                </div>
                <h2
                  className="mt-4 text-xl font-semibold text-center"
                  style={{ color: 'var(--color-text)', margin: '14px 0 0' }}
                >
                  {opt.label}
                </h2>
                <p
                  className="text-center"
                  style={{
                    color: 'var(--color-text-muted)',
                    marginTop: 8,
                    fontSize: 14,
                  }}
                >
                  {opt.description}
                </p>
                {opt.highlight && (
                  <p
                    className="text-center"
                    style={{
                      color: 'var(--color-secondary)',
                      fontWeight: 600,
                      marginTop: 8,
                      fontSize: 13,
                    }}
                  >
                    {opt.highlight}
                  </p>
                )}
              </div>

              {/* Preview details */}
              <div className="card-content" style={{ paddingTop: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 13 }}
                  >
                    What’s included
                  </div>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    aria-label={`More details about ${opt.label} role`}
                    onClick={() => setInfoIndex((v) => (v === idx ? null : idx))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setInfoIndex((v) => (v === idx ? null : idx));
                      }
                    }}
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  >
                    {infoIndex === idx ? 'Hide' : 'Info'}
                  </button>
                </div>

                <ul
                  style={{
                    marginTop: 10,
                    paddingLeft: 18,
                    color: 'var(--color-text)',
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {opt.permissions.map((p) => (
                    <li key={p} style={{ listStyle: 'disc' }}>
                      {p}
                    </li>
                  ))}
                </ul>

                <div
                  className="u-surface"
                  style={{
                    marginTop: 12,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--color-text-muted)',
                  }}
                  aria-live="polite"
                >
                  Post‑signup destination: <strong style={{ color: 'var(--color-text)' }}>{opt.destination}</strong>
                </div>

                {infoIndex === idx && (
                  <div
                    role="dialog"
                    aria-modal="false"
                    aria-label={`${opt.label} role details`}
                    className="u-surface"
                    style={{
                      marginTop: 12,
                      padding: '12px',
                      borderLeft: '3px solid var(--color-primary)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text)' }}>
                      {opt.label} offers tools tailored to {opt.label.toLowerCase()} needs.
                      You can switch roles before completing registration.
                    </p>
                    {opt.requiresInvite && (
                      <p
                        style={{
                          margin: '8px 0 0 0',
                          fontSize: 13,
                          color: 'var(--color-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        Invite code required during the wizard.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="card-footer" style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className="btn btn-primary"
                  aria-label={opt.aria}
                >
                  Continue as {opt.label}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-label={`Preview ${opt.label} experience`}
                  onClick={() => setInfoIndex((v) => (v === idx ? null : idx))}
                >
                  Preview
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Secondary actions */}
        <div className="mt-8 text-center" role="navigation" aria-label="Secondary actions">
          <button
            type="button"
            onClick={() => handleSelect('member')}
            className="btn btn-ghost"
            style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
          >
            Continue as Member
          </button>
        </div>
      </div>
    </main>
  );
}
