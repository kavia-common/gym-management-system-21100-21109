import React from 'react';
import '../styles-fix.css';

/**
 * PUBLIC_INTERFACE
 * SimpleTable - Minimal, reusable table with columns and data plus optional row actions.
 *
 * Props:
 * - columns: [{ key: string, label: string, render?: (row) => ReactNode }]
 * - data: any[]
 * - loading?: boolean
 * - emptyMessage?: string
 * - onRowClick?: (row) => void
 * - actions?: (row) => ReactNode  // action buttons per row
 */
export default function SimpleTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  actions,
}) {
  return (
    <div className="simple-table-wrapper">
      <table className="simple-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            {actions ? <th style={{ width: 1 }}>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Loading...
              </td>
            </tr>
          ) : data?.length ? (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={onRowClick ? 'clickable' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key}>
                    {typeof c.render === 'function' ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {actions ? <td onClick={(e) => e.stopPropagation()}>{actions(row)}</td> : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
