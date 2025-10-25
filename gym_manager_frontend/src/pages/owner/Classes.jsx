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
 * OwnerClasses - Manage class catalog and schedules.
 */
export default function OwnerClasses() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', trainer: '', capacity: 10 });

  const useMocks = config.useMocks;

  const fetchData = async () => {
    setLoading(true);
    try {
      if (useMocks) {
        const mock = [
          { id: 'c1', title: 'HIIT', trainer: 'Alex M', capacity: 20 },
          { id: 'c2', title: 'Yoga Flow', trainer: 'Priya K', capacity: 15 },
        ];
        await new Promise(r => setTimeout(r, 200));
        setItems(mock);
      } else {
        const res = await httpClient.get(endpoints.classes.list);
        setItems(res.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch classes', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onCreate = async () => {
    try {
      if (useMocks) {
        setItems((prev) => [{ id: `c_${Date.now()}`, ...form, capacity: Number(form.capacity) || 0 }, ...prev]);
        setOpen(false);
        setForm({ title: '', trainer: '', capacity: 10 });
      } else {
        await httpClient.post(endpoints.classes.list, form);
        setOpen(false);
        setForm({ title: '', trainer: '', capacity: 10 });
        fetchData();
      }
    } catch (e) {
      console.error('Failed to create class', e);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Classes"
        subtitle="Manage classes offered by your gym"
        action={<Button onClick={() => setOpen(true)}>Add Class</Button>}
      >
        <SimpleTable columns={columns} data={items} loading={loading} />
      </Card>

      <Modal
        open={open}
        title="Add Class"
        onClose={() => setOpen(false)}
        primaryAction={<Button onClick={onCreate}>Save</Button>}
        secondaryAction={<Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>}
      >
        <EntityForm fields={fields} values={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
