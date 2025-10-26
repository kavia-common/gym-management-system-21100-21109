import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EntityForm from '../../components/shared/EntityForm';
import SimpleTable from '../../components/shared/SimpleTable';
import { useSelector } from 'react-redux';
import { programsService } from '../../services/supabase';

/**
 * PUBLIC_INTERFACE
 * TrainerPrograms - Manage training programs using Supabase services.
 */
export default function TrainerPrograms() {
  const authUser = useSelector((s) => s.auth?.user);
  const trainerId = authUser?.id || authUser?.trainer_id || authUser?.trainerId || authUser?.uid;

  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', weeks: 4 });
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);

  const columns = [
    { key: 'title', label: 'Program' },
    { key: 'weeks', label: 'Weeks' },
  ];

  const fields = [
    { name: 'title', label: 'Title', required: true, placeholder: 'e.g., Core Builder' },
    { name: 'weeks', label: 'Duration (weeks)', type: 'number', required: true, placeholder: '4' },
  ];

  async function load() {
    if (!trainerId) return;
    setStatus('loading');
    setError(null);
    try {
      const { data } = await programsService.list({ page: 1, limit: 100, trainerId });
      setItems(data || []);
      setStatus('succeeded');
    } catch (e) {
      setError(e?.message || 'Failed to load programs');
      setStatus('failed');
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId]);

  async function onCreate() {
    if (!form.title) return;
    setSaving(true);
    setError(null);

    // Optimistic insert with rollback on failure
    const optimistic = { id: `tmp_${Date.now()}`, ...form, weeks: Number(form.weeks) || 0, trainerId };
    setItems((prev) => [optimistic, ...prev]);
    try {
      const created = await programsService.create({ title: form.title, weeks: Number(form.weeks) || 0, trainerId });
      // Replace optimistic with server item
      setItems((prev) => prev.map((p) => (p.id === optimistic.id ? created : p)));
      setOpen(false);
      setForm({ title: '', weeks: 4 });
    } catch (e) {
      // rollback
      setItems((prev) => prev.filter((p) => p.id !== optimistic.id));
      setError(e?.message || 'Failed to create program');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    setDeletingId(id);
    setError(null);
    const backup = items;
    // optimistic remove
    setItems((prev) => prev.filter((p) => p.id !== id));
    try {
      await programsService.remove(id);
    } catch (e) {
      // rollback if failed
      setItems(backup);
      setError(e?.message || 'Failed to delete program');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Programs"
        subtitle="Design and manage your training programs"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => setOpen(true)}>New Program</Button>
            <Button variant="secondary" onClick={load} disabled={status === 'loading'}>
              {status === 'loading' ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        }
      >
        {status === 'failed' ? (
          <div style={{ color: 'var(--color-error)', marginBottom: 12 }}>{error}</div>
        ) : null}
        <SimpleTable
          columns={[
            ...columns,
            {
              key: 'actions',
              label: '',
              render: (row) => (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(row.id)}
                    disabled={deletingId === row.id}
                    aria-label={`Delete program ${row.title}`}
                  >
                    {deletingId === row.id ? 'Deleting…' : 'Delete'}
                  </Button>
                </div>
              ),
            },
          ]}
          data={items}
        />
        {status === 'loading' && <div style={{ marginTop: 12, color: 'var(--color-text-muted)' }}>Loading…</div>}
        {!items.length && status === 'succeeded' && (
          <div style={{ marginTop: 12, color: 'var(--color-text-muted)' }}>No programs yet. Create your first one.</div>
        )}
      </Card>

      <Modal
        open={open}
        title="New Program"
        onClose={() => setOpen(false)}
        primaryAction={
          <Button onClick={onCreate} disabled={saving || !form.title}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        }
        secondaryAction={
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
        }
      >
        {error && <div style={{ color: 'var(--color-error)', marginBottom: 12 }}>{error}</div>}
        <EntityForm fields={fields} values={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
