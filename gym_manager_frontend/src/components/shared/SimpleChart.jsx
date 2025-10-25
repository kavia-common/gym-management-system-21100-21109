import React from 'react';
import Card from '../ui/Card';

/**
 * PUBLIC_INTERFACE
 * SimpleChart - Lightweight placeholder chart that renders basic bars from series data.
 *
 * Props:
 * - title?: string
 * - series: { label: string, value: number }[]
 */
export default function SimpleChart({ title = 'Chart', series = [] }) {
  const max = Math.max(1, ...series.map((s) => s.value || 0));
  return (
    <Card title={title} subtitle="Preview">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
        {series.map((s) => {
          const h = Math.max(8, Math.round((s.value / max) * 120));
          return (
            <div key={s.label} style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
              <div
                title={`${s.label}: ${s.value}`}
                style={{
                  width: 28,
                  height: h,
                  background: 'var(--color-primary)',
                  borderRadius: 6,
                  boxShadow: 'var(--shadow-sm)',
                }}
              />
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
