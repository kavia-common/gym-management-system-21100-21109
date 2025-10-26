import React from 'react';
import Card from '../../components/ui/Card';
import EntityForm from '../../components/shared/EntityForm';
import Button from '../../components/ui/Button';
import { profilesService } from '../../services/supabase';

/**
 * PUBLIC_INTERFACE
 * MemberProfile - Profile form backed by Supabase profiles table.
 * Loads current user's profile and allows updating basic fields.
 */
export default function MemberProfile() {
  const [form, setForm] = React.useState({ name: '', email: '' });
  const [initial, setInitial] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const profile = await profilesService.getCurrent();
        const values = {
          name: profile?.name || profile?.full_name || '',
          email: profile?.email || '',
        };
        if (active) {
          setForm(values);
          setInitial(values);
        }
      } catch (e) {
        if (active) setError(e.message || 'Failed to load profile');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const fields = [
    { name: 'name', label: 'Full Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ];

  const handleCancel = () => {
    if (initial) setForm(initial);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // getCurrent also gives us the id via auth, but update requires explicit id
      const curr = await profilesService.getCurrent();
      await profilesService.update(curr.id, {
        name: form.name,
        email: form.email,
      });
      setInitial(form);
    } catch (e) {
      setError(e.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Profile" subtitle="Manage your account">
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: '#EF4444' }}>{error}</div>}
      {!loading && (
        <div style={{ display: 'grid', gap: 12 }}>
          <EntityForm fields={fields} values={form} onChange={setForm} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={handleCancel} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
