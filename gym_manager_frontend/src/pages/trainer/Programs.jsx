import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EntityForm from '../../components/shared/EntityForm';
import SimpleTable from '../../components/shared/SimpleTable';

/**
 * PUBLIC_INTERFACE
 * TrainerPrograms - Manage training programs.
 */
export default function TrainerPrograms() {
  const [items, setItems] = React.useState([
    { id: 'pr1', title: 'Beginner Strength', weeks: 6 },
  ]);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', weeks: 4 });

  const columns = [
    { key: 'title', label: 'Program' },
    { key: 'weeks', label: 'Weeks' },
  ];

  const fields = [
    { name: 'title', label: 'Title', required: true, placeholder: 'e.g., Core Builder' },
    { name: 'weeks', label: 'Duration (weeks)', type: 'number', required: true, placeholder: '4' },
  ];

  const onCreate = () => {
    setItems((prev) => [{ id: `pr_${Date.now()}`, ...form, weeks: Number(form.weeks) || 0 }, ...prev]);
    setOpen(false);
    setForm({ title: '', weeks: 4 });
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Programs"
        subtitle="Design and manage your training programs"
        action={<Button onClick={() => setOpen(true)}>New Program</Button>}
      >
        <SimpleTable columns={columns} data={items} />
      </Card>

      <Modal
        open={open}
        title="New Program"
        onClose={() => setOpen(false)}
        primaryAction={<Button onClick={onCreate}>Save</Button>}
        secondaryAction={<Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>}
      >
        <EntityForm fields={fields} values={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
