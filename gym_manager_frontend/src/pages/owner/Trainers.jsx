import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SimpleTable from '../../components/shared/SimpleTable';
import EntityForm from '../../components/shared/EntityForm';
import endpoints from '../../api/endpoints';
import { httpClient } from '../../api/httpClient';
import { config } from '../../config';

/**
 * PUBLIC_INTERFACE
 * OwnerTrainers - Manage trainers.
 */
export default function OwnerTrainers() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', specialty: '', email: '' });

  const useMocks = config.useMocks;

  const fetchData = async () => {
    setLoading(true);
    try {
      if (useMocks) {
        const mock = [
          { id: 't1', name: 'Alex Morgan', specialty: 'HIIT', email: 'alex@gym.com' },
          { id: 't2', name: 'Priya K', specialty: 'Yoga', email: 'priya@gym.com' },
        ];
        await new Promise(r => setTimeout(r, 200));
        setItems(mock);
      } else {
        const res = await httpClient.get(endpoints.trainers.list);
        setItems(res.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch trainers', e);
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
    { key: 'specialty', label: 'Specialty' },
    { key: 'email', label: 'Email' },
  ];

  const fields = [
    { name: 'name', label: 'Name', required: true, placeholder: 'Trainer Name' },
    { name: 'specialty', label: 'Specialty', required: true, placeholder: 'e.g., Strength' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'trainer@gym.com' },
  ];

  const onCreate = async () => {
    try {
      if (useMocks) {
        setItems((prev) => [{ id: `t_${Date.now()}`, ...form }, ...prev]);
        setOpen(false);
        setForm({ name: '', specialty: '', email: '' });
      } else {
        await httpClient.post(endpoints.trainers.list, form);
        setOpen(false);
        setForm({ name: '', specialty: '', email: '' });
        fetchData();
      }
    } catch (e) {
      console.error('Failed to create trainer', e);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Trainers"
        subtitle="Manage your trainers"
        action={<Button onClick={() => setOpen(true)}>Add Trainer</Button>}
      >
        <SimpleTable columns={columns} data={items} loading={loading} />
      </Card>

      <Modal
        open={open}
        title="Add Trainer"
        onClose={() => setOpen(false)}
        primaryAction={<Button onClick={onCreate}>Save</Button>}
        secondaryAction={<Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>}
      >
        <EntityForm fields={fields} values={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
