import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import PlanComparison from './PlanComparison';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

/**
 * PUBLIC_INTERFACE
 * RegistrationWizard
 * Multi-step registration flow:
 * 1. Account (email/password) if not logged in
 * 2. Personal details
 * 3. Plan selection & comparison
 * 4. Review
 * 5. Proceed to payment (placeholder)
 *
 * - Prefills or skips Account step if user is logged in via Supabase Auth context
 * - Persists in-progress state in localStorage to protect against refresh
 * - Validates required fields and shows accessible error messages
 */
export default function RegistrationWizard() {
  const { session, signUp, loading: authLoading } = useAuth() || {};
  const userEmail = session?.user?.email || '';

  const STORAGE_KEY = 'registration_wizard_state_v1';
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState('');

  // Form State
  const [account, setAccount] = useState({ email: '', password: '' });
  const [personal, setPersonal] = useState({ firstName: '', lastName: '', phone: '' });
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Mock plans (could be fetched later)
  const plans = useMemo(
    () => [
      {
        id: 'basic',
        name: 'Basic',
        price: 29,
        interval: 'month',
        features: ['Gym access', 'Locker room', 'Standard support'],
      },
      {
        id: 'plus',
        name: 'Plus',
        price: 49,
        interval: 'month',
        features: ['All Basic features', 'Group classes', 'Priority support'],
        highlight: true,
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 79,
        interval: 'month',
        features: ['All Plus features', 'Personal training (1/mo)', 'Nutrition guidance'],
      },
    ],
    []
  );

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setStep(parsed.step ?? 0);
        setAccount(parsed.account ?? { email: '', password: '' });
        setPersonal(parsed.personal ?? { firstName: '', lastName: '', phone: '' });
        setSelectedPlanId(parsed.selectedPlanId ?? '');
        setAcceptTerms(!!parsed.acceptTerms);
      } else if (userEmail) {
        // If logged in, prefill account and skip step 0
        setAccount({ email: userEmail, password: '' });
        setStep(1);
      }
    } catch {
      // ignore corrupted storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // Persist state
  useEffect(() => {
    const payload = { step, account, personal, selectedPlanId, acceptTerms };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // storage may fail (quota/private mode)
    }
  }, [step, account, personal, selectedPlanId, acceptTerms]);

  // Determine visible steps if logged in
  const effectiveSteps = useMemo(() => {
    // If session exists, we skip Step 0 (Account)
    return session ? ['Personal', 'Plan', 'Review', 'Payment'] : ['Account', 'Personal', 'Plan', 'Review', 'Payment'];
  }, [session]);

  const totalSteps = effectiveSteps.length;

  function next() {
    setErrors({});
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  // Validation
  function validateCurrentStep() {
    const e = {};
    const currentLabel = effectiveSteps[step];
    if (currentLabel === 'Account') {
      if (!account.email) e.email = 'Email is required.';
      else if (!/^\S+@\S+\.\S+$/.test(account.email)) e.email = 'Please enter a valid email address.';
      if (!account.password || account.password.length < 6) e.password = 'Password must be at least 6 characters.';
    } else if (currentLabel === 'Personal') {
      if (!personal.firstName) e.firstName = 'First name is required.';
      if (!personal.lastName) e.lastName = 'Last name is required.';
      if (!personal.phone) e.phone = 'Phone is required.';
    } else if (currentLabel === 'Plan') {
      if (!selectedPlanId) e.plan = 'Please choose a plan to continue.';
    } else if (currentLabel === 'Review') {
      if (!acceptTerms) e.terms = 'You must accept the terms and conditions.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleContinue() {
    if (!validateCurrentStep()) return;

    const currentLabel = effectiveSteps[step];
    if (currentLabel === 'Account') {
      // attempt sign up with Supabase if not logged in
      try {
        setSaving(true);
        setStatusMsg('');
        const emailRedirect =
          process.env.REACT_APP_SITE_URL
            ? `${process.env.REACT_APP_SITE_URL}/auth/callback`
            : window.location.origin + '/auth/callback';
        const { error } = await signUp?.({
          email: account.email,
          password: account.password,
          options: { emailRedirectTo: emailRedirect },
        });
        if (error) {
          setErrors({ account: error.message || 'Sign up failed. Please try again.' });
          setSaving(false);
          return;
        }
        setStatusMsg('Check your inbox to confirm your email before logging in.');
      } catch (err) {
        setErrors({ account: err?.message || 'An unexpected error occurred during sign up.' });
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }
    next();
  }

  function renderStepper() {
    return (
      <nav aria-label="Steps" style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {effectiveSteps.map((label, idx) => {
          const active = idx === step;
          const completed = idx < step;
          return (
            <div
              key={label}
              aria-current={active ? 'step' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 999,
                background: active ? '#2563EB' : completed ? '#dbeafe' : '#eef2ff',
                color: active ? '#ffffff' : '#1f2937',
                fontWeight: 600,
                transition: 'all .2s ease',
              }}
            >
              <span style={{
                width: 24,
                height: 24,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: active ? '#1d4ed8' : completed ? '#bfdbfe' : '#e5e7eb',
                color: active ? '#fff' : '#111827',
                fontSize: 12,
              }}>{idx + 1}</span>
              <span>{label}</span>
            </div>
          );
        })}
      </nav>
    );
  }

  function renderAccount() {
    return (
      <div>
        <h2 style={{ marginTop: 0, color: '#111827' }}>Create your account</h2>
        <p style={{ color: '#6b7280' }}>Sign up to start your membership. A confirmation link will be emailed to you.</p>
        {errors.account && <div role="alert" style={{ color: '#EF4444', marginBottom: 12 }}>{errors.account}</div>}
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <span className="sr-only">Email</span>
            <Input
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-email' : undefined}
              placeholder="Email"
              type="email"
              value={account.email}
              onChange={(e) => setAccount((s) => ({ ...s, email: e.target.value }))}
            />
            {errors.email && <div id="err-email" role="alert" style={{ color: '#EF4444', fontSize: 12 }}>{errors.email}</div>}
          </label>
          <label>
            <span className="sr-only">Password</span>
            <Input
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'err-password' : undefined}
              placeholder="Password"
              type="password"
              value={account.password}
              onChange={(e) => setAccount((s) => ({ ...s, password: e.target.value }))}
            />
            {errors.password && <div id="err-password" role="alert" style={{ color: '#EF4444', fontSize: 12 }}>{errors.password}</div>}
          </label>
        </div>
        {statusMsg && <div style={{ marginTop: 8, color: '#2563EB' }}>{statusMsg}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button onClick={handleContinue} disabled={saving || authLoading}>
            {saving || authLoading ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </div>
    );
  }

  function renderPersonal() {
    return (
      <div>
        <h2 style={{ marginTop: 0, color: '#111827' }}>Personal details</h2>
        <p style={{ color: '#6b7280' }}>Tell us a bit about you.</p>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <span className="sr-only">First name</span>
            <Input
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'err-fn' : undefined}
              placeholder="First name"
              value={personal.firstName}
              onChange={(e) => setPersonal((s) => ({ ...s, firstName: e.target.value }))}
            />
            {errors.firstName && <div id="err-fn" role="alert" style={{ color: '#EF4444', fontSize: 12 }}>{errors.firstName}</div>}
          </label>
          <label>
            <span className="sr-only">Last name</span>
            <Input
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'err-ln' : undefined}
              placeholder="Last name"
              value={personal.lastName}
              onChange={(e) => setPersonal((s) => ({ ...s, lastName: e.target.value }))}
            />
            {errors.lastName && <div id="err-ln" role="alert" style={{ color: '#EF4444', fontSize: 12 }}>{errors.lastName}</div>}
          </label>
          <label>
            <span className="sr-only">Phone</span>
            <Input
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'err-ph' : undefined}
              placeholder="Phone"
              value={personal.phone}
              onChange={(e) => setPersonal((s) => ({ ...s, phone: e.target.value }))}
            />
            {errors.phone && <div id="err-ph" role="alert" style={{ color: '#EF4444', fontSize: 12 }}>{errors.phone}</div>}
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="secondary" onClick={back}>Back</Button>
          <Button onClick={handleContinue}>Continue</Button>
        </div>
      </div>
    );
  }

  function renderPlan() {
    return (
      <div>
        <h2 style={{ marginTop: 0, color: '#111827' }}>Choose your plan</h2>
        <p style={{ color: '#6b7280' }}>Compare features to find the perfect fit.</p>
        {errors.plan && <div role="alert" style={{ color: '#EF4444', marginBottom: 12 }}>{errors.plan}</div>}
        <PlanComparison
          plans={plans}
          selectedPlanId={selectedPlanId}
          onSelectPlan={setSelectedPlanId}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="secondary" onClick={back}>Back</Button>
          <Button onClick={handleContinue}>Continue</Button>
        </div>
      </div>
    );
  }

  function renderReview() {
    const plan = plans.find((p) => p.id === selectedPlanId);
    return (
      <div>
        <h2 style={{ marginTop: 0, color: '#111827' }}>Review & confirm</h2>
        <div
          style={{
            marginTop: 8,
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 16,
          }}
          role="region"
          aria-label="Review details"
        >
          <dl style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8, margin: 0 }}>
            <dt style={{ color: '#6b7280' }}>Email</dt>
            <dd style={{ margin: 0, color: '#111827' }}>{account.email || userEmail || '—'}</dd>

            <dt style={{ color: '#6b7280' }}>Name</dt>
            <dd style={{ margin: 0, color: '#111827' }}>
              {personal.firstName} {personal.lastName}
            </dd>

            <dt style={{ color: '#6b7280' }}>Phone</dt>
            <dd style={{ margin: 0, color: '#111827' }}>{personal.phone}</dd>

            <dt style={{ color: '#6b7280' }}>Plan</dt>
            <dd style={{ margin: 0, color: '#111827' }}>
              {plan ? `${plan.name} — $${plan.price}/${plan.interval}` : '—'}
            </dd>
          </dl>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              aria-invalid={!!errors.terms}
              aria-describedby={errors.terms ? 'err-terms' : undefined}
            />
            <span>I agree to the Terms and Conditions and Privacy Policy.</span>
          </label>
          {errors.terms && <div id="err-terms" role="alert" style={{ color: '#EF4444', fontSize: 12 }}>{errors.terms}</div>}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="secondary" onClick={back}>Back</Button>
          <Button onClick={handleContinue}>Proceed to payment</Button>
        </div>
      </div>
    );
  }

  function renderPayment() {
    const plan = plans.find((p) => p.id === selectedPlanId);
    return (
      <div>
        <h2 style={{ marginTop: 0, color: '#111827' }}>Payment setup</h2>
        <p style={{ color: '#6b7280' }}>
          Stripe integration is coming soon. For now, this is a placeholder screen. Clicking "Complete Registration"
          will simulate success and clear the wizard state.
        </p>
        <div
          role="region"
          aria-label="Order summary"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <strong style={{ color: '#111827' }}>Order summary</strong>
          <div style={{ marginTop: 8, color: '#374151' }}>
            Plan: {plan ? plan.name : '—'} — ${plan ? plan.price : '—'} / {plan ? plan.interval : '—'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={back}>Back</Button>
          <Button
            onClick={() => {
              try {
                localStorage.removeItem(STORAGE_KEY);
              } catch {
                // ignore
              }
              setStatusMsg('Registration complete! You can manage your membership in your dashboard.');
            }}
          >
            Complete Registration
          </Button>
        </div>
        {statusMsg && <div role="status" style={{ marginTop: 12, color: '#2563EB' }}>{statusMsg}</div>}
      </div>
    );
  }

  const containerStyle = {
    maxWidth: 900,
    margin: '0 auto',
    padding: 16,
  };
  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.08)',
  };
  const headerStyle = {
    marginBottom: 16,
    padding: '16px 20px',
    background: 'linear-gradient(135deg, rgba(37,99,235,0.05), #f9fafb)',
    borderRadius: 16,
    border: '1px solid #dbeafe',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, color: '#111827' }}>Membership Registration</h1>
        <p style={{ margin: '6px 0 0', color: '#6b7280' }}>
          Ocean Professional experience — smooth, clear, and secure.
        </p>
      </div>
      {renderStepper()}
      <div style={cardStyle}>
        {effectiveSteps[step] === 'Account' && renderAccount()}
        {effectiveSteps[step] === 'Personal' && renderPersonal()}
        {effectiveSteps[step] === 'Plan' && renderPlan()}
        {effectiveSteps[step] === 'Review' && renderReview()}
        {effectiveSteps[step] === 'Payment' && renderPayment()}
      </div>
    </div>
  );
}
