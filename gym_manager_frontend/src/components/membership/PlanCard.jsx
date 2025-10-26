import React from 'react';
import PropTypes from 'prop-types';
import '../styles-fix.css';

/**
 * PUBLIC_INTERFACE
 * PlanCard
 * A presentational card for displaying a membership plan with price and features.
 * Accessible and responsive, themed with Ocean Professional styles.
 */
export default function PlanCard({
  name,
  price,
  interval,
  features,
  highlight = false,
  onSelect,
  selected = false,
  actionLabel = 'Select',
  testId,
}) {
  return (
    <div
      data-testid={testId}
      className={`plan-card ${highlight ? 'plan-card--highlight' : ''} ${selected ? 'plan-card--selected' : ''}`}
      role="group"
      aria-label={`${name} plan`}
      style={{
        background: '#ffffff',
        border: selected ? '2px solid #2563EB' : '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
        boxShadow: highlight ? '0 10px 25px rgba(37, 99, 235, 0.15)' : '0 4px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0, color: '#111827' }}>{name}</h3>
        <span style={{ color: '#6b7280', fontSize: 14 }}>{interval}</span>
      </div>

      <div style={{ marginTop: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#2563EB' }}>${price}</span>
        <span style={{ marginLeft: 6, color: '#6b7280' }}>/ {interval}</span>
      </div>

      <ul style={{ paddingLeft: 18, margin: '0 0 16px 0' }}>
        {features?.map((f, idx) => (
          <li key={idx} style={{ color: '#374151', marginBottom: 6 }}>{f}</li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="btn plan-card__button"
        style={{
          width: '100%',
          background: selected ? '#2563EB' : 'linear-gradient(135deg, rgba(37,99,235,0.1), #f9fafb)',
          color: selected ? '#ffffff' : '#111827',
          border: '1px solid #2563EB',
          padding: '10px 12px',
          borderRadius: 10,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}

PlanCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  interval: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string),
  highlight: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  actionLabel: PropTypes.string,
  testId: PropTypes.string,
};
