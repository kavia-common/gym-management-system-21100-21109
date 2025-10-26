import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SimpleTable from '../../components/shared/SimpleTable';
import EntityForm from '../../components/shared/EntityForm';
import { membersService } from '../../services/supabase';
import { config } from '../../config';

/**
 * PUBLIC_INTERFACE
 * OwnerMembers - List and manage gym members via Supabase with CRUD, pagination, and optimistic updates.
 */
export default function OwnerMembers() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', email: '', status: 'active' });
  const [page, setPage] = React.useState(1);
  const [hasNext, setHasNext] = React.useState(false);

  const useMocks = config.useMocks;

  const load = async (p = page) => {
    setLoading(true);
    setError('');
    try {
      if (useMocks) {
        // In mock mode, surface a clear notice
        setItems([]);
        setHasNext(false);
        setError('Supabase disabled (mock mode). Disable mocks to load real data.');
      } else {
        const { data, pagination } = await membersService.list({ page: p, limit: 10 });
        setItems(data);
        setHasNext(!!pagination?.hasNext);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch members', e);
      setError(e?.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onResetForm = () => {
    setForm({ name: '', email: '', status: 'active' });
    setEditing(null);
  };

  const onCreate = async () => {
    if (useMocks) return;
    setError('');
    // optimistic add
    const tempId = `tmp_${Date.now()}`;
    const optimistic = { id: tempId, ...form };
    setItems((prev) => [optimistic, ...prev]);
    setOpen(false);

    try {
      const created = await membersService.create(form);
      setItems((prev) => prev.map((it) => (it.id === tempId ? created : it)));
      onResetForm();
    } catch (e) {
      setItems((prev) => prev.filter((it) => it.id !== tempId));
      setError(e?.message || 'Failed to create member');
    }
  };

  const onUpdate = async (row) => {
    if (useMocks) return;
    setError('');
    const original = items.find((it) => it.id === row.id);
    const patch = { ...row };
    // optimistic update
    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, ...patch } : it)));
    try {
      const updated = await membersService.update(row.id, patch);
      setItems((prev) => prev.map((it) => (it.id === row.id ? updated : it)));
    } catch (e) {
      // revert
      setItems((prev) => prev.map((it) => (it.id === row.id ? original : it)));
      setError(e?.message || 'Failed to update member');
    }
  };

  const onDelete = async (row) => {
    if (useMocks) return;
    setError('');
    const original = items;
    // optimistic remove
    setItems((prev) => prev.filter((it) => it.id !== row.id));
    try {
      await membersService.remove(row.id);
    } catch (e) {
      setItems(original);
      setError(e?.message || 'Failed to delete member');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (r) => <span style={{ color: r.status === 'active' ? 'green' : 'var(--color-text-muted)' }}>{r.status}</span> },
  ];

  const fields = [
    { name: 'name', label: 'Full Name', required: true, placeholder: 'Jane Doe' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'jane@example.com' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
      ],
    },
  ];

  const actions = (row) => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Button size="sm" variant="secondary" onClick={() => { setEditing(row); setForm({ name: row.name || '', email: row.email || '', status: row.status || 'active' }); setOpen(true); }}>Edit</Button>
      <Button size="sm" variant="ghost" onClick={() => onDelete(row)}>Delete</Button>
    </div>
  );

  const onPrimaryAction = async () => {
    if (editing) {
      await onUpdate({ ...editing, ...form });
      setOpen(false);
      onResetForm();
    } else {
      await onCreate();
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Members"
        subtitle="Manage all gym members"
        action={<div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => { onResetForm(); setOpen(true); }}>Add Member</Button>
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
        title={editing ? 'Edit Member' : 'Add Member'}
        onClose={() => { setOpen(false); onResetForm(); }}
        primaryAction={<Button onClick={onPrimaryAction}>{editing ? 'Update' : 'Save'}</Button>}
        secondaryAction={<Button variant="secondary" onClick={() => { setOpen(false); onResetForm(); }}>Cancel</Button>}
      >
        <EntityForm fields={fields} values={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
