import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';
import Button from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import { membersService, bookingsService, classesService } from '../../services/supabase';

/**
 * PUBLIC_INTERFACE
 * TrainerClients - List of assigned clients for the signed-in trainer using Supabase.
 * Strategy:
 * - Identify clients who have bookings in classes taught by this trainer.
 * - This avoids needing a direct trainerId on member; relies on bookings -> classes -> trainerId.
 */
export default function TrainerClients() {
  const authUser = useSelector((s) => s.auth?.user);
  const trainerId = authUser?.id || authUser?.trainer_id || authUser?.trainerId || authUser?.uid;

  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState(null);

  const columns = [
    { key: 'name', label: 'Client' },
    { key: 'goal', label: 'Goal' },
  ];

  async function load() {
    if (!trainerId) return;
    setStatus('loading');
    setError(null);
    try {
      // Step 1: fetch classes for this trainer
      const { data: classes } = await classesService.listByTrainer(trainerId, { page: 1, limit: 200 });
      const classIds = (classes || []).map((c) => c.id);
      if (!classIds.length) {
        setItems([]);
        setStatus('succeeded');
        return;
      }

      // Step 2: fetch bookings for those classes
      const { data: bookings } = await bookingsService.list({ page: 1, limit: 500 });
      const memberIds = Array.from(
        new Set((bookings || []).filter((b) => classIds.includes(b.classId)).map((b) => b.memberId))
      );

      if (!memberIds.length) {
        setItems([]);
        setStatus('succeeded');
        return;
      }

      // Step 3: fetch members by ids (membersService.list does not filter by ids; fetch and filter client-side)
      const { data: allMembers } = await membersService.list({ page: 1, limit: 1000 });
      const assigned = (allMembers || []).filter((m) => memberIds.includes(m.id));

      const mapped = assigned.map((m) => ({
        id: m.id,
        name: m.name || m.fullName || m.email || 'Unknown',
        goal: m.goal || m.objective || '—',
      }));

      setItems(mapped);
      setStatus('succeeded');
    } catch (e) {
      setError(e?.message || 'Failed to load clients');
      setStatus('failed');
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId]);

  return (
    <Card
      title="Clients"
      subtitle="Assigned clients"
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
        <div style={{ marginTop: 12, color: 'var(--color-text-muted)' }}>No clients found.</div>
      )}
    </Card>
  );
}
