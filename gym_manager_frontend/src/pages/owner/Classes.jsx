import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SimpleTable from '../../components/shared/SimpleTable';
import EntityForm from '../../components/shared/EntityForm';
import { classesService } from '../../services/supabase';
import { config } from '../../config';

/**
 * PUBLIC_INTERFACE
 * OwnerClasses - Manage class catalog and schedules via Supabase with CRUD and pagination.
 */
export default function OwnerClasses() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({ title: '', trainer: '', capacity: 10 });
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
        const { data, pagination } = await classesService.list({ page: p, limit: 10 });
        setItems(data);
        setHasNext(!!pagination?.hasNext);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch classes', e);
      setError(e?.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onResetForm = () => {
    setForm({ title: '', trainer: '', capacity: 10 });
    setEditing(null);
  };

  const onCreate = async () => {
    if (useMocks) return;
    setError('');
    const tempId = `tmp_${Date.now()}`;
    const optimistic = { id: tempId, ...form, capacity: Number(form.capacity) || 0 };
    setItems((prev) => [optimistic, ...prev]);
    setOpen(false);
    try {
      const created = await classesService.create({ ...form, capacity: Number(form.capacity) || 0 });
      setItems((prev) => prev.map((it) => (it.id === tempId ? created : it)));
      onResetForm();
    } catch (e) {
      setItems((prev) => prev.filter((it) => it.id !== tempId));
      setError(e?.message || 'Failed to create class');
    }
  };

  const onUpdate = async (row) => {
    if (useMocks) return;
    setError('');
    const original = items.find((it) => it.id === row.id);
    const patch = { ...row, capacity: Number(row.capacity) || 0 };
    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, ...patch } : it)));
    try {
      const updated = await classesService.update(row.id, patch);
      setItems((prev) => prev.map((it) => (it.id === row.id ? updated : it)));
    } catch (e) {
      setItems((prev) => prev.map((it) => (it.id === row.id ? original : it)));
      setError(e?.message || 'Failed to update class');
    }
  };

  const onDelete = async (row) => {
    if (useMocks) return;
    setError('');
    const original = items;
    setItems((prev) => prev.filter((it) => it.id !== row.id));
    try {
      await classesService.remove(row.id);
    } catch (e) {
      setItems(original);
      setError(e?.message || 'Failed to delete class');
    }
  };

  const columns = [
    { key: 'title', label: 'Class' },
    { key: 'trainer', label: 'Trainer' },
    { key: 'capacity', label: 'Capacity' },
  ];

  const fields = [
    { name: 'title', label: 'Title', required: true, placeholder: 'e.g., Power Pump' },
    { name: 'trainer', label: 'Trainer', required: true, placeholder: 'e.g., Jordan' },
    { name: 'capacity', label: 'Capacity', type: 'number', required: true, placeholder: '10' },
  ];

  const actions = (row) => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Button size="sm" variant="secondary" onClick={() => { setEditing(row); setForm({ title: row.title || '', trainer: row.trainer || '', capacity: row.capacity || 10 }); setOpen(true); }}>Edit</Button>
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
        title="Classes"
        subtitle="Manage classes offered by your gym"
        action={<div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => { onResetForm(); setOpen(true); }}>Add Class</Button>
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
        title={editing ? 'Edit Class' : 'Add Class'}
        onClose={() => { setOpen(false); onResetForm(); }}
        primaryAction={<Button onClick={onPrimaryAction}>{editing ? 'Update' : 'Save'}</Button>}
        secondaryAction={<Button variant="secondary" onClick={() => { setOpen(false); onResetForm(); }}>Cancel</Button>}
      >
        <EntityForm fields={fields} values={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
