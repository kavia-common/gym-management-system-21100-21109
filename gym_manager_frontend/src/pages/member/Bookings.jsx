import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabaseClient';
import { bookingsService, classesService } from '../../services/supabase';

/**
 * PUBLIC_INTERFACE
 * MemberBookings - Show and manage member's class bookings.
 * Fetches bookings scoped to the signed-in member (Supabase auth user),
 * displays loading and error states, and supports cancel (delete) with
 * optimistic updates.
 */
export default function MemberBookings() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [workingIds, setWorkingIds] = React.useState(new Set());

  // Derive current user id from Supabase auth
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
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Fetch bookings for this member
        const { data: bookings } = await bookingsService.list({ memberId: userId, limit: 100 });

        // Join with classes for display fields in UI (title/date)
        // Fetch all classes referenced by the bookings in a single pass
        const classIds = Array.from(new Set((bookings || []).map(b => b.classId))).filter(Boolean);
        let classesById = {};
        if (classIds.length > 0) {
          const { data: allClasses } = await classesService.list({ limit: 200 });
          classesById = (allClasses || []).reduce((acc, c) => {
            acc[c.id] = c;
            return acc;
          }, {});
        }

        const rows = (bookings || []).map(b => {
          const cls = classesById[b.classId] || {};
          return {
            id: b.id,
            title: cls.title || `Class ${b.classId}`,
            date: cls.scheduledAt || b.createdAt,
            status: b.status || 'confirmed',
          };
        });

        if (active) setItems(rows);
      } catch (e) {
        if (active) setError(e.message || 'Failed to load bookings');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [userId]);

  const columns = [
    { key: 'title', label: 'Class' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ];

  const handleCancel = async (row) => {
    if (!row?.id) return;
    // Optimistic update
    const prev = items;
    const next = prev.filter(b => b.id !== row.id);
    setItems(next);
    setWorkingIds(new Set([...Array.from(workingIds), row.id]));

    try {
      await bookingsService.remove(row.id);
    } catch (e) {
      // Revert on failure
      setItems(prev);
      setError(e.message || 'Failed to cancel booking');
    } finally {
      const updated = new Set(Array.from(workingIds));
      updated.delete(row.id);
      setWorkingIds(updated);
    }
  };

  const actions = (row) => (
    <Button
      size="sm"
      variant="secondary"
      disabled={workingIds.has(row.id)}
      onClick={() => handleCancel(row)}
    >
      {workingIds.has(row.id) ? 'Cancelling...' : 'Cancel'}
    </Button>
  );

  return (
    <Card title="My Bookings" subtitle="Upcoming classes">
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: '#EF4444' }}>{error}</div>}
      {!loading && !error && items.length === 0 && <div>No bookings yet.</div>}
      {!loading && !error && items.length > 0 && (
        <SimpleTable columns={columns} data={items} actions={actions} />
      )}
    </Card>
  );
}
