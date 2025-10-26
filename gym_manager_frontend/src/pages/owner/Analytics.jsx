import React from 'react';
import SimpleChart from '../../components/shared/SimpleChart';
import Card from '../../components/ui/Card';
import { paymentsService, membersService } from '../../services/supabase';
import { config } from '../../config';

/**
 * PUBLIC_INTERFACE
 * OwnerAnalytics - Basic analytics using Supabase data when available, otherwise clear placeholder.
 */
export default function OwnerAnalytics() {
  const [series, setSeries] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const useMocks = config.useMocks;

  const buildMonthlyCounts = (rows, dateKey = 'date') => {
    // Group by YYYY-MM
    const map = new Map();
    rows.forEach((r) => {
      const d = new Date(r[dateKey]);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    // Take last 6 months sorted ascending
    const keys = Array.from(map.keys()).sort();
    const last = keys.slice(-6);
    return last.map((k) => ({ label: k, value: map.get(k) || 0 }));
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      if (useMocks) {
        setSeries([]);
        setError('Supabase disabled (mock mode). Disable mocks to load analytics.');
      } else {
        // Fetch small pages and aggregate; for demo purpose
        const [payments, members] = await Promise.all([
          paymentsService.list({ page: 1, limit: 100 }),
          membersService.list({ page: 1, limit: 100 }),
        ]);
        const paySeries = buildMonthlyCounts(payments.data || [], 'date');
        const memSeries = buildMonthlyCounts(members.data || [], 'createdAt');
        // Prefer members chart; if empty, fallback to payments
        const finalSeries = memSeries?.length ? memSeries : paySeries;
        if (!finalSeries.length) {
          setError('Analytics data not available yet. Add members or payments to see trends.');
        }
        setSeries(finalSeries);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load analytics', e);
      setError(e?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SimpleChart title="Monthly New Members" series={series} />
      <Card title="Notes">
        {loading ? (
          <div style={{ color: 'var(--color-text-muted)' }}>Loading analytics...</div>
        ) : error ? (
          <div style={{ color: 'var(--color-error)' }}>{error}</div>
        ) : !series.length ? (
          <div style={{ color: 'var(--color-text-muted)' }}>
            Analytics data will appear as your gym records members and payments.
          </div>
        ) : (
          <div style={{ color: 'var(--color-text-muted)' }}>
            Showing the last few months of activity based on available data.
          </div>
        )}
      </Card>
    </div>
  );
}
