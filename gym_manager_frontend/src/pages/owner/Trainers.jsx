import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SimpleTable from '../../components/shared/SimpleTable';
import EntityForm from '../../components/shared/EntityForm';
import { trainersService, profilesService } from '../../services/supabase';
import { config } from '../../config';

/**
 * PUBLIC_INTERFACE
 * OwnerTrainers - Manage trainers via Supabase with CRUD and pagination.
 * Adds Pending Approvals section to approve or reject trainer accounts.
 */
export default function OwnerTrainers() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', specialty: '', email: '' });
  const [page, setPage] = React.useState(1);
  const [hasNext, setHasNext] = React.useState(false);

  const [pending, setPending] = React.useState([]);
  const [pendingLoading, setPendingLoading] = React.useState(false);
  const [pendingError, setPendingError] = React.useState('');

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
        const { data, pagination } = await trainersService.list({ page: p, limit: 10 });
        setItems(data);
        setHasNext(!!pagination?.hasNext);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch trainers', e);
      setError(e?.message || 'Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const loadPending = async () => {
    setPendingLoading(true);
    setPendingError('');
    try {
      if (useMocks) {
        setPending([]);
        setPendingError('Supabase disabled (mock mode). Disable mocks to load real data.');
      } else {
        const data = await profilesService.listTrainersByStatus('pending');
        setPending(data);
      }
    } catch (e) {
      setPendingError(e?.message || 'Failed to fetch pending trainers');
    } finally {
      setPendingLoading(false);
    }
  };

  React.useEffect(() => {
    load(1);
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onResetForm = () => {
    setForm({ name: '', specialty: '', email: '' });
    setEditing(null);
  };

  const onCreate = async () => {
    if (useMocks) return;
    setError('');
    const tempId = `tmp_${Date.now()}`;
    const optimistic = { id: tempId, ...form };
    setItems((prev) => [optimistic, ...prev]);
    setOpen(false);
    try {
      const created = await trainersService.create(form);
      setItems((prev) => prev.map((it) => (it.id === tempId ? created : it)));
      onResetForm();
    } catch (e) {
      setItems((prev) => prev.filter((it) => it.id !== tempId));
      setError(e?.message || 'Failed to create trainer');
    }
  };

  const onUpdate = async (row) => {
    if (useMocks) return;
    setError('');
    const original = items.find((it) => it.id === row.id);
    const patch = { ...row };
    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, ...patch } : it)));
    try {
      const updated = await trainersService.update(row.id, patch);
      setItems((prev) => prev.map((it) => (it.id === row.id ? updated : it)));
    } catch (e) {
      setItems((prev) => prev.map((it) => (it.id === row.id ? original : it)));
      setError(e?.message || 'Failed to update trainer');
    }
  };

  const onDelete = async (row) => {
    if (useMocks) return;
    setError('');
    const original = items;
    setItems((prev) => prev.filter((it) => it.id !== row.id));
    try {
      await trainersService.remove(row.id);
    } catch (e) {
      setItems(original);
      setError(e?.message || 'Failed to delete trainer');
    }
  };

  const onApprove = async (p) => {
    if (useMocks) return;
    try {
      await profilesService.approveTrainer(p.id);
      setPending((prev) => prev.filter((it) => it.id !== p.id));
    } catch (e) {
      setPendingError(e?.message || 'Failed to approve trainer');
    }
  };

  const onReject = async (p) => {
    if (useMocks) return;
    try {
      await profilesService.rejectTrainer(p.id);
      setPending((prev) => prev.filter((it) => it.id !== p.id));
    } catch (e) {
      setPendingError(e?.message || 'Failed to reject trainer');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'email', label: 'Email' },
  ];

  const pendingColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
  ];

  const fields = [
    { name: 'name', label: 'Name', required: true, placeholder: 'Trainer Name' },
    { name: 'specialty', label: 'Specialty', required: true, placeholder: 'e.g., Strength' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'trainer@gym.com' },
  ];

  const actions = (row) => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Button size="sm" variant="secondary" onClick={() => { setEditing(row); setForm({ name: row.name || '', specialty: row.specialty || '', email: row.email || '' }); setOpen(true); }}>Edit</Button>
      <Button size="sm" variant="ghost" onClick={() => onDelete(row)}>Delete</Button>
    </div>
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Pending Trainer Approvals"
        subtitle="Approve or reject trainer access requests"
        action={<Button variant="secondary" onClick={loadPending}>Refresh</Button>}
      >
        {pendingError ? <div style={{ color: 'var(--color-error)', marginBottom: 8 }}>{pendingError}</div> : null}
        <SimpleTable
          columns={pendingColumns}
          data={pending}
          loading={pendingLoading}
          actions={(row) => (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" onClick={() => onApprove(row)}>Approve</Button>
              <Button size="sm" variant="ghost" onClick={() => onReject(row)}>Reject</Button>
            </div>
          )}
        />
      </Card>

      <Card
        title="Trainers"
        subtitle="Manage your trainers"
        action={<div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => { setEditing(null); setForm({ name: '', specialty: '', email: '' }); setOpen(true); }}>Add Trainer</Button>
          <Button variant="secondary" onClick={() => load(1)}>Refresh</Button>
        </div>}
      >
        {error ? <div style={{ color: 'var(--color-error)', marginBottom: 8 }}>{error}</div> : null}
        <SimpleTable columns={columns} data={items} loading={loading} actions={actions} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <Button variant="secondary" disabled={loading || page <= 1} onClick={async () => { const next = Math.max(1, page - 1); setPage(next); await load(next); }}>Previous</Button>
          <div style={{ color: 'var(--color-text-muted)' }}>Page {page}</div>
          <Button variant="secondary" disabled={loading || !hasNext} onClick={async () => { const next = page + 1; setPage(next); await load(next); }}>Next</Button>
        </div>
      </Card>

      <Modal
        open={open}
        title={editing ? 'Edit Trainer' : 'Add Trainer'}
        onClose={() => { setOpen(false); setEditing(null); setForm({ name: '', specialty: '', email: '' }); }}
        primaryAction={<Button onClick={async () => { if (editing) { await (async () => { await trainersService.update(editing.id, { ...editing, ...form }); await load(page); setOpen(false); setEditing(null); })(); } else { await onCreate(); } }}>{editing ? 'Update' : 'Save'}</Button>}
        secondaryAction={<Button variant="secondary" onClick={() => { setOpen(false); setEditing(null); setForm({ name: '', specialty: '', email: '' }); }}>Cancel</Button>}
      >
        <EntityForm fields={fields} values={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
