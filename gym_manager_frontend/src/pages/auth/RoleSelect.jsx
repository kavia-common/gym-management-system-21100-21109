import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationStore } from '../../state/useRegistrationStore';
import '../../styles/theme.css';

/**
 * Role option configuration: label, value, description, and icon (emoji for now).
 */
const ROLE_OPTIONS = [
  {
    label: 'Member',
    value: 'member',
    description: 'Join classes, manage your bookings, and track your progress.',
    icon: '🧘',
    aria: 'Select Member role',
  },
  {
    label: 'Trainer',
    value: 'trainer',
    description: 'Create classes, manage clients, and view performance analytics.',
    icon: '🏋️',
    aria: 'Select Trainer role',
  },
  {
    label: 'Admin/Owner',
    value: 'owner',
    description: 'Manage gym operations, memberships, payments, and analytics.',
    icon: '🗂️',
    aria: 'Select Admin or Owner role',
  },
];

/**
 * PUBLIC_INTERFACE
 * RoleSelect
 * Accessible role selection screen for registration onboarding.
 * On selection, persists role to localStorage via useRegistrationStore and routes to /register.
 */
export default function RoleSelect() {
  const navigate = useNavigate();
  const { setRole } = useRegistrationStore();

  const handleSelect = (value) => {
    setRole(value);
    navigate('/register');
  };

  return (
    <main
      className="min-h-screen bg-[var(--background,#f9fafb)]"
      aria-labelledby="get-started-title"
    >
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1
            id="get-started-title"
            className="text-3xl font-bold text-[var(--text,#111827)]"
          >
            Get Started
          </h1>
          <p className="mt-2 text-[color:var(--text,#111827)]/70">
            Choose how you’ll use the Gym Manager platform.
          </p>
        </header>

        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          aria-label="Role options"
          role="list"
        >
          {ROLE_OPTIONS.map((opt) => (
            <article
              key={opt.value}
              role="listitem"
              className="group rounded-xl shadow-sm border border-gray-200 bg-white p-6 focus-within:ring-2 focus-within:ring-blue-500/70 focus-within:outline-none transition transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/10 to-gray-50 text-3xl mx-auto">
                <span aria-hidden="true">{opt.icon}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-center text-[var(--text,#111827)]">
                {opt.label}
              </h2>
              <p className="mt-2 text-sm text-center text-gray-600">{opt.description}</p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className="inline-flex items-center justify-center w-full md:w-auto px-5 py-2.5 rounded-lg bg-[var(--primary,#2563EB)] text-white font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary,#2563EB)] hover:bg-blue-600 transition"
                  aria-label={opt.aria}
                >
                  Continue as {opt.label}
                </button>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => handleSelect('member')}
            className="text-sm text-blue-700 hover:text-blue-800 underline underline-offset-2"
          >
            Skip and continue as Member
          </button>
        </div>
      </div>
    </main>
  );
}
