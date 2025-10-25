import React from 'react';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Input - Text input with label and helper/error message.
 */
export default function Input({
  label,
  message,
  error,
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  const messageId = `${inputId}-msg`;
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {label ? (
        <label htmlFor={inputId} style={{ fontWeight: 600, fontSize: 14 }}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className="input"
        aria-invalid={!!error}
        aria-describedby={message ? messageId : undefined}
        {...props}
      />
      {message ? (
        <div
          id={messageId}
          style={{
            fontSize: 12,
            color: error ? 'var(--color-error)' : 'var(--color-text-muted)'
          }}
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}
