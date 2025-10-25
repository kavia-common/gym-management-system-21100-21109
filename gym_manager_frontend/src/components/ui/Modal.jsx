import React, { useEffect } from 'react';
import Button from './Button';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Modal - Accessible modal dialog with header, content, and actions.
 */
export default function Modal({
  open,
  title,
  children,
  onClose,
  primaryAction,
  secondaryAction
}) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) onClose?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title || 'Dialog'}>
      <div className="modal-panel">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <Button variant="ghost" aria-label="Close dialog" onClick={onClose}>✕</Button>
        </div>
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          {secondaryAction}
          {primaryAction}
        </div>
      </div>
    </div>
  );
}
