import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';
import Button from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import { classesService } from '../../services/supabase';

/**
 * PUBLIC_INTERFACE
 * TrainerTimetable - Shows trainer's upcoming classes/sessions for the signed-in trainer using Supabase.
 */
export default function TrainerTimetable() {
  const authUser = useSelector((s) => s.auth?.user);
  const trainerId = authUser?.id || authUser?.trainer_id || authUser?.trainerId || authUser?.uid;

  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState('idle'); // 'idle' | 'loading' | 'succeeded' | 'failed'
  const [error, setError] = React.useState(null);

  const columns = [
    { key: 'scheduledAt', label: 'Time' },
    { key: 'title', label: 'Class' },
    { key: 'location', label: 'Location' },
  ];

  async function load() {
    if (!trainerId) return;
    setStatus('loading');
    setError(null);
    try {
      const { data } = await classesService.listByTrainer(trainerId, { page: 1, limit: 50 });
      // Map to UI structure if needed
      const mapped = (data || []).map((c) => ({
        id: c.id,
        scheduledAt: new Date(c.scheduledAt).toLocaleString(),
        title: c.title,
        location: c.location || c.room || '—',
      }));
      setItems(mapped);
      setStatus('succeeded');
    } catch (e) {
      setError(e?.message || 'Failed to load timetable');
      setStatus('failed');
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId]);

  return (
    <Card
      title="Timetable"
      subtitle="Your upcoming sessions"
      action={
        <Button onClick={load} disabled={status === 'loading'}>
          {status === 'loading' ? 'Refreshing…' : 'Refresh'}
        </Button>
      }
    >
      {status === 'failed' ? (
        <div style={{ color: 'var(--color-error)', marginBottom: 12 }}>{error}</div>
      ) : null}
      <SimpleTable columns={columns} data={items} />
      {status === 'loading' && <div style={{ marginTop: 12, color: 'var(--color-text-muted)' }}>Loading…</div>}
      {!items.length && status === 'succeeded' && (
        <div style={{ marginTop: 12, color: 'var(--color-text-muted)' }}>No upcoming sessions.</div>
      )}
    </Card>
  );
}
