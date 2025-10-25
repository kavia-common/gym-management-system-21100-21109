import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';
import endpoints from '../../api/endpoints';
import { httpClient } from '../../api/httpClient';

/**
 * PUBLIC_INTERFACE
 * OwnerPayments - View recent payments.
 */
export default function OwnerPayments() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const useMocks = String(process.env.REACT_APP_USE_MOCKS || '') === 'true';

  const fetchData = async () => {
    setLoading(true);
    try {
      if (useMocks) {
        const mock = [
          { id: 'p1', member: 'John Carter', amount: 49.99, date: '2025-01-05' },
          { id: 'p2', member: 'Ava Wilson', amount: 59.99, date: '2025-01-04' },
        ];
        await new Promise(r => setTimeout(r, 200));
        setItems(mock);
      } else {
        const res = await httpClient.get('/payments'); // not in endpoints map yet
        setItems(res.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch payments', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { key: 'member', label: 'Member' },
    { key: 'amount', label: 'Amount', render: (r) => `$${Number(r.amount).toFixed(2)}` },
    { key: 'date', label: 'Date' },
  ];

  return (
    <Card title="Payments" subtitle="Recent transactions">
      <SimpleTable columns={columns} data={items} loading={loading} />
    </Card>
  );
}
