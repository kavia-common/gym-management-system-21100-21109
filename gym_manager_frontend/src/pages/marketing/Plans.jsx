import React, { useMemo, useState } from 'react';
import PlanComparison from '../../components/membership/PlanComparison';
import Button from '../../components/ui/Button.jsx';

/**
 * PUBLIC_INTERFACE
 * Plans Page
 * Public marketing page to view and compare available membership plans.
 */
export default function Plans() {
  const [selected, setSelected] = useState('');

  const plans = useMemo(
    () => [
      { id: 'basic', name: 'Basic', price: 29, interval: 'month', features: ['Gym access', 'Locker room', 'Standard support'] },
      { id: 'plus', name: 'Plus', price: 49, interval: 'month', features: ['All Basic features', 'Group classes', 'Priority support'], highlight: true },
      { id: 'pro', name: 'Pro', price: 79, interval: 'month', features: ['All Plus features', 'Personal training (1/mo)', 'Nutrition guidance'] },
    ],
    []
  );

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <header
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.05), #f9fafb)',
          border: '1px solid #dbeafe',
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0, color: '#111827' }}>Membership Plans</h1>
        <p style={{ margin: '6px 0 0', color: '#6b7280' }}>
          Compare features and pricing to find the best plan for your goals.
        </p>
      </header>

      <PlanComparison
        plans={plans}
        selectedPlanId={selected}
        onSelectPlan={setSelected}
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <a href="/register" aria-label="Proceed to registration with selected plan">
          <Button disabled={!selected}>Continue with {selected || 'plan'}</Button>
        </a>
      </div>
    </main>
  );
}
