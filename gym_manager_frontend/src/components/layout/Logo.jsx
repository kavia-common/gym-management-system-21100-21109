import React from 'react';

/**
 * PUBLIC_INTERFACE
 * A simple logo component showing a gym emoji styled with the Ocean Professional theme colors.
 * - Renders without any theme text like "Ocean Professional".
 * - Provides accessible aria-label and alt text.
 */
const Logo = ({ size = 28 }) => {
  // Colors from Ocean Professional theme
  const primary = '#2563EB';   // blue
  const secondary = '#F59E0B'; // amber

  // Inline style to keep dependencies minimal and ensure easy theme matching.
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size + 10,
    height: size + 10,
    borderRadius: 8,
    background: `linear-gradient(135deg, ${primary}15, ${secondary}10)`,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  };

  const emojiStyle = {
    fontSize: size,
    lineHeight: 1,
    // Subtle text shadow to pop on both light/dark
    textShadow: '0 1px 1px rgba(0,0,0,0.1)',
  };

  return (
    <div
      role="img"
      aria-label="Gym Manager logo"
      title="Gym Manager"
      style={style}
    >
      <span style={emojiStyle} aria-hidden="true">🏋️‍♂️</span>
    </div>
  );
};

export default Logo;
