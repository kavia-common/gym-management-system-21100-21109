import React from 'react';
import Card from '../../components/ui/Card';
import EntityForm from '../../components/shared/EntityForm';
import Button from '../../components/ui/Button';

/**
 * PUBLIC_INTERFACE
 * MemberProfile - Basic profile form.
 */
export default function MemberProfile() {
  const [form, setForm] = React.useState({ name: 'Demo Member', email: 'member@example.com' });

  const fields = [
    { name: 'name', label: 'Full Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ];

  return (
    <Card title="Profile" subtitle="Manage your account">
      <div style={{ display: 'grid', gap: 12 }}>
        <EntityForm fields={fields} values={form} onChange={setForm} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => alert('Changes discarded (demo)')}>Cancel</Button>
          <Button onClick={() => alert('Profile saved (demo)')}>Save</Button>
        </div>
      </div>
    </Card>
  );
}
