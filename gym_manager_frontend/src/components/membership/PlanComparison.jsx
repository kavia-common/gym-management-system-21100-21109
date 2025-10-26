import React from 'react';
import PropTypes from 'prop-types';
import PlanCard from './PlanCard';

/**
 * PUBLIC_INTERFACE
 * PlanComparison
 * Displays a responsive grid of PlanCard components for quick comparison and selection.
 */
export default function PlanComparison({ plans, selectedPlanId, onSelectPlan }) {
  return (
    <section aria-label="Membership plan comparison" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: 16 }}>
      <style>{`
        @media (min-width: 640px) {
          section[aria-label="Membership plan comparison"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          section[aria-label="Membership plan comparison"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}</style>
      {plans.map((p) => (
        <PlanCard
          key={p.id}
          testId={`plan-${p.id}`}
          name={p.name}
          price={p.price}
          interval={p.interval}
          features={p.features}
          highlight={p.highlight}
          selected={selectedPlanId === p.id}
          onSelect={() => onSelectPlan(p.id)}
          actionLabel={selectedPlanId === p.id ? 'Selected' : 'Choose Plan'}
        />
      ))}
    </section>
  );
}

PlanComparison.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      interval: PropTypes.string,
      features: PropTypes.arrayOf(PropTypes.string),
      highlight: PropTypes.bool,
    })
  ).isRequired,
  selectedPlanId: PropTypes.string,
  onSelectPlan: PropTypes.func.isRequired,
};
