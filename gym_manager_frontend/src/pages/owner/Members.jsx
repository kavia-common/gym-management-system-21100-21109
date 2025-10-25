import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SimpleTable from '../../components/shared/SimpleTable';
import EntityForm from '../../components/shared/EntityForm';
import endpoints from '../../api/endpoints';
import { httpClient } from '../../api/httpClient';

/**
 * PUBLIC_INTERFACE
 * OwnerMembers - List and manage gym members.
 */
export default function OwnerMembers() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', status: 'active' });

  const useMocks = String(process.env.REACT_APP_USE_MOCKS || '') === 'true';

  const fetchData = async () => {
    setLoading(true);
    try {
      if (useMocks) {
        // mock list
        const mock = [
          { id: 'm1', name: 'John Carter', email: 'john@example.com', status: 'active' },
          { id: 'm2', name: 'Ava Wilson', email: 'ava@example.com', status: 'paused' },
        ];
        await new Promise(r => setTimeout(r, 200));
        setItems(mock);
      } else {
        const res = await httpClient.get(endpoints.members.list);
        setItems(res.data || []);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch members', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onCreate = async () => {
    try {
      if (useMocks) {
        setItems((prev) => [{ id: `m_${Date.now()}`, ...form }, ...prev]);
        setOpen(false);
        setForm({ name: '', email: '', status: 'active' });
      } else {
        await httpClient.post(endpoints.members.list, form);
        setOpen(false);
        setForm({ name: '', email: '', status: 'active' });
        fetchData();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to create member', e);
    }
  };

  const actions = (row) => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Button size="sm" variant="secondary" onClick={() => alert(`Edit ${row.name} (demo)`)}>Edit</Button>
      <Button size="sm" variant="ghost" onClick={() => alert(`More actions for ${row.name} (demo)`)}>•••</Button>
    </div>
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Members"
        subtitle="Manage all gym members"
        action={<Button onClick={() => setOpen(true)}>Add Member</Button>}
      >
        <SimpleTable columns={columns} data={items} loading={loading} actions={actions} />
      </Card>

      <Modal
        open={open}
        title="Add Member"
        onClose={() => setOpen(false)}
        primaryAction={<Button onClick={onCreate}>Save</Button>}
        secondaryAction={<Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>}
      >
        <EntityForm fields={fields} values={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
