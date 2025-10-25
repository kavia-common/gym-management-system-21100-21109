import React from 'react';
import Input from '../ui/Input';

/**
 * PUBLIC_INTERFACE
 * EntityForm - Generic controlled form renderer for creating/editing entities.
 *
 * Props:
 * - fields: [{ name, label, type?, placeholder?, required?, render?({value,onChange}) }]
 * - values: object
 * - onChange: (nextValues) => void
 * - errors?: Record<string,string>
 */
export default function EntityForm({ fields = [], values = {}, onChange, errors = {} }) {
  const setField = (name, value) => {
    onChange?.({ ...values, [name]: value });
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {fields.map((f) => {
        const val = values[f.name] ?? '';
        const err = errors[f.name];
        if (typeof f.render === 'function') {
          return (
            <div key={f.name}>
              <label style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 6 }}>{f.label}</label>
              {f.render({ value: val, onChange: (v) => setField(f.name, v) })}
              {err ? <div style={{ color: 'var(--color-error)', fontSize: 12, marginTop: 4 }}>{err}</div> : null}
            </div>
          );
        }
        if (f.type === 'select' && Array.isArray(f.options)) {
          return (
            <div key={f.name} style={{ display: 'grid', gap: 6 }}>
              <label htmlFor={`f-${f.name}`} style={{ fontWeight: 600, fontSize: 14 }}>{f.label}</label>
              <select
                id={`f-${f.name}`}
                className="input"
                value={val}
                onChange={(e) => setField(f.name, e.target.value)}
                required={f.required}
              >
                {(f.options || []).map((o) => (
                  <option key={`${f.name}-${o.value}`} value={o.value}>{o.label}</option>
                ))}
              </select>
              {err ? <div style={{ color: 'var(--color-error)', fontSize: 12 }}>{err}</div> : null}
            </div>
          );
        }
        return (
          <Input
            key={f.name}
            label={f.label}
            type={f.type || 'text'}
            placeholder={f.placeholder}
            value={val}
            onChange={(e) => setField(f.name, e.target.value)}
            error={!!err}
            message={err}
          />
        );
      })}
    </div>
  );
}
