import React from 'react';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Card - Surface container with header/content/footer composition.
 */
export default function Card({ title, subtitle, action, children, footer, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle || action) && (
        <div className="card-header">
          <div>
            {title ? <h3 className="card-title">{title}</h3> : null}
            {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
          </div>
          <div>{action}</div>
        </div>
      )}
      <div className="card-content">{children}</div>
      {footer ? <div className="card-footer">{footer}</div> : null}
    </div>
  );
}
