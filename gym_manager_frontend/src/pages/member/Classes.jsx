import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';
import Button from '../../components/ui/Button';
import supabase from '../../lib/supabaseClient';
import { classesService, bookingsService } from '../../services/supabase';

/**
 * PUBLIC_INTERFACE
 * MemberClasses - Browse classes and book using Supabase.
 * Loads upcoming classes, shows loading/error states,
 * and performs booking with optimistic feedback.
 */
export default function MemberClasses() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [bookingIds, setBookingIds] = React.useState(new Set());
  const [userId, setUserId] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    async function readUser() {
      try {
        const { data, error: authErr } = await supabase.auth.getUser();
        if (authErr) throw authErr;
        const uid = data?.user?.id || null;
        if (mounted) setUserId(uid);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to read session');
      }
    }
    readUser();
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await classesService.listUpcoming({ limit: 100 });
        const rows = (data || []).map(c => ({
          id: c.id,
          title: c.title,
          trainer: c.trainer || c.trainerName || 'TBD',
          when: c.scheduledAt || c.when || '',
        }));
        if (active) setItems(rows);
      } catch (e) {
        if (active) setError(e.message || 'Failed to load classes');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const handleBook = async (row) => {
    if (!row?.id || !userId) {
      setError('You must be signed in to book a class.');
      return;
    }
    // visual feedback: disable the button
    const next = new Set([...Array.from(bookingIds), row.id]);
    setBookingIds(next);

    try {
      await bookingsService.enrollInClass({ memberId: userId, classId: row.id });
      // Optionally notify success
    } catch (e) {
      setError(e.message || 'Failed to book class');
    } finally {
      const upd = new Set(Array.from(bookingIds));
      upd.delete(row.id);
      setBookingIds(upd);
    }
  };

  const columns = [
    { key: 'title', label: 'Class' },
    { key: 'trainer', label: 'Trainer' },
    { key: 'when', label: 'Schedule' },
  ];

  const actions = (row) => (
    <Button size="sm" onClick={() => handleBook(row)} disabled={bookingIds.has(row.id)}>
      {bookingIds.has(row.id) ? 'Booking...' : 'Book'}
    </Button>
  );

  return (
    <Card title="Classes" subtitle="Available to book">
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: '#EF4444' }}>{error}</div>}
      {!loading && !error && items.length === 0 && <div>No classes available.</div>}
      {!loading && !error && items.length > 0 && (
        <SimpleTable columns={columns} data={items} actions={actions} />
      )}
    </Card>
  );
}
