import React from 'react';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Button - Themed button component supporting variants and sizes.
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  ...props
}) {
  const sizeClass =
    size === 'sm' ? { padding: '8px 12px', fontSize: 13 } :
    size === 'lg' ? { padding: '12px 18px', fontSize: 16 } :
    { padding: '10px 16px', fontSize: 14 };

  const variantClass =
    variant === 'secondary' ? 'btn-secondary' :
    variant === 'ghost' ? 'btn-ghost' :
    'btn-primary';

  return (
    <button className={`btn ${variantClass}`} style={sizeClass} {...props}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
