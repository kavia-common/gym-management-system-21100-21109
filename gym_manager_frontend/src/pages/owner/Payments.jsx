import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';
import Button from '../../components/ui/Button';
import { paymentsService } from '../../services/supabase';
import { config } from '../../config';

/**
 * PUBLIC_INTERFACE
 * OwnerPayments - View recent payments via Supabase with pagination and loading/error states.
 */
export default function OwnerPayments() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [hasNext, setHasNext] = React.useState(false);

  const useMocks = config.useMocks;

  const load = async (p = page) => {
    setLoading(true);
    setError('');
    try {
      if (useMocks) {
        setItems([]);
        setHasNext(false);
        setError('Supabase disabled (mock mode). Disable mocks to load real data.');
      } else {
        const { data, pagination } = await paymentsService.list({ page: p, limit: 10 });
        setItems(data);
        setHasNext(!!pagination?.hasNext);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch payments', e);
      setError(e?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { key: 'member', label: 'Member' },
    { key: 'amount', label: 'Amount', render: (r) => `$${Number(r.amount).toFixed(2)}` },
    { key: 'date', label: 'Date' },
  ];

  return (
    <Card title="Payments" subtitle="Recent transactions">
      {error ? <div style={{ color: 'var(--color-error)', marginBottom: 8 }}>{error}</div> : null}
      <SimpleTable columns={columns} data={items} loading={loading} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <Button variant="secondary" disabled={loading || page <= 1} onClick={async () => { const next = Math.max(1, page - 1); setPage(next); await load(next); }}>Previous</Button>
        <div style={{ color: 'var(--color-text-muted)' }}>Page {page}</div>
        <Button variant="secondary" disabled={loading || !hasNext} onClick={async () => { const next = page + 1; setPage(next); await load(next); }}>Next</Button>
      </div>
    </Card>
  );
}
