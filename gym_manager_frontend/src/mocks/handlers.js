import { http, HttpResponse, delay } from 'msw';
import endpoints from '../api/endpoints';
import membersSeed from './data/members.json';
import trainersSeed from './data/trainers.json';
import classesSeed from './data/classes.json';
import bookingsSeed from './data/bookings.json';
import programsSeed from './data/programs.json';
import paymentsSeed from './data/payments.json';

/**
 * PUBLIC_INTERFACE
 * buildHandlers - Returns an array of MSW handlers that implement the documented API contract
 * for auth, members, trainers, classes, bookings, programs, and payments.
 * The handlers mutate in-memory copies of the seed data during the app session.
 */
export function buildHandlers() {
  // In-memory mutable copies
  let members = [...membersSeed];
  let trainers = [...trainersSeed];
  let classes = [...classesSeed];
  let bookings = [...bookingsSeed];
  let programs = [...programsSeed];
  let payments = [...paymentsSeed];

  // Utility: pagination and query filters
  const withPagination = (items, page = 1, limit = 20) => {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.min(100, Math.max(1, Number(limit) || 20));
    const start = (p - 1) * l;
    const slice = items.slice(start, start + l);
    return {
      data: slice,
      pagination: {
        page: p,
        limit: l,
        total: items.length,
        hasNext: start + l < items.length,
      },
    };
  };

  const toISO = (d) => (typeof d === 'string' ? d : new Date(d).toISOString());
  const genId = (prefix) => `${prefix}_${Date.now()}`;

  // Basic fake auth state (token/user) in memory
  let currentUser = null;
  const requireAuth = (req) => {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    return Boolean(token); // simple check for demo
  };

  const authHandlers = [
    http.post(endpoints.auth.login, async ({ request }) => {
      await delay(200);
      try {
        const body = await request.json();
        const { email, password } = body || {};
        if (!email || !password) {
          return HttpResponse.json(
            { error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' } },
            { status: 400 }
          );
        }
        const role = email.includes('owner')
          ? 'owner'
          : email.includes('trainer')
          ? 'trainer'
          : 'member';
        currentUser = {
          id: 'u_demo',
          name: 'Demo User',
          role,
          email,
        };
        return HttpResponse.json({ token: 'mock-jwt-token', user: currentUser }, { status: 200 });
      } catch {
        return HttpResponse.json({ error: { code: 'SERVER_ERROR', message: 'Unexpected error' } }, { status: 500 });
      }
    }),

    http.post(endpoints.auth.register, async ({ request }) => {
      await delay(250);
      try {
        const body = await request.json();
        const { name, email, password, role = 'member' } = body || {};
        if (!name || !email || !password) {
          return HttpResponse.json(
            { error: { code: 'VALIDATION_ERROR', message: 'All fields are required.' } },
            { status: 400 }
          );
        }
        currentUser = {
          id: genId('u'),
          name,
          role,
          email,
        };
        return HttpResponse.json({ token: 'mock-jwt-token', user: currentUser }, { status: 201 });
      } catch {
        return HttpResponse.json({ error: { code: 'SERVER_ERROR', message: 'Unexpected error' } }, { status: 500 });
      }
    }),

    http.get(endpoints.auth.me, async ({ request }) => {
      await delay(150);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      if (!currentUser) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'No session' } }, { status: 401 });
      }
      return HttpResponse.json(currentUser, { status: 200 });
    }),

    http.post(endpoints.auth.refresh, async () => {
      await delay(120);
      return HttpResponse.json({ token: 'mock-jwt-token' }, { status: 200 });
    }),

    http.post(endpoints.auth.logout, async () => {
      await delay(80);
      currentUser = null;
      return new HttpResponse(null, { status: 204 });
    }),
  ];

  // Members CRUD
  const memberHandlers = [
    http.get(endpoints.members.list, async ({ request, request: { url } }) => {
      await delay(200);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const u = new URL(url);
      const q = u.searchParams.get('q') || '';
      const status = u.searchParams.get('status') || '';
      const page = u.searchParams.get('page') || '1';
      const limit = u.searchParams.get('limit') || '20';

      let list = [...members];
      if (q) {
        const lc = q.toLowerCase();
        list = list.filter((m) => m.name.toLowerCase().includes(lc) || m.email.toLowerCase().includes(lc));
      }
      if (status) {
        list = list.filter((m) => m.status === status);
      }
      return HttpResponse.json(withPagination(list, page, limit), { status: 200 });
    }),

    http.post(endpoints.members.list, async ({ request }) => {
      await delay(200);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const body = await request.json();
      const { name, email, status = 'active' } = body || {};
      if (!name || !email) {
        return HttpResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'name and email are required' } }, { status: 400 });
      }
      if (members.some((m) => m.email === email)) {
        return HttpResponse.json({ error: { code: 'CONFLICT', message: 'Email exists' } }, { status: 409 });
      }
      const created = {
        id: genId('m'),
        name,
        email,
        status,
        createdAt: toISO(new Date()),
      };
      members.unshift(created);
      return HttpResponse.json(created, { status: 201 });
    }),

    http.get(/\/members\/[^/]+$/, async ({ request }) => {
      await delay(120);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const m = members.find((x) => x.id === id);
      if (!m) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      return HttpResponse.json(m, { status: 200 });
    }),

    http.patch(/\/members\/[^/]+$/, async ({ request }) => {
      await delay(150);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const idx = members.findIndex((x) => x.id === id);
      if (idx === -1) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      const patch = await request.json();
      members[idx] = { ...members[idx], ...patch };
      return HttpResponse.json(members[idx], { status: 200 });
    }),

    http.delete(/\/members\/[^/]+$/, async ({ request }) => {
      await delay(120);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const before = members.length;
      members = members.filter((m) => m.id !== id);
      if (members.length === before) {
        return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      }
      return new HttpResponse(null, { status: 204 });
    }),
  ];

  // Trainers CRUD
  const trainerHandlers = [
    http.get(endpoints.trainers.list, async ({ request, request: { url } }) => {
      await delay(180);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const u = new URL(url);
      const q = u.searchParams.get('q') || '';
      const specialty = u.searchParams.get('specialty') || '';
      const page = u.searchParams.get('page') || '1';
      const limit = u.searchParams.get('limit') || '20';

      let list = [...trainers];
      if (q) {
        const lc = q.toLowerCase();
        list = list.filter((t) => t.name.toLowerCase().includes(lc) || t.email.toLowerCase().includes(lc));
      }
      if (specialty) list = list.filter((t) => String(t.specialty).toLowerCase() === specialty.toLowerCase());
      return HttpResponse.json(withPagination(list, page, limit), { status: 200 });
    }),

    http.post(endpoints.trainers.list, async ({ request }) => {
      await delay(200);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const { name, email, specialty } = (await request.json()) || {};
      if (!name || !email || !specialty) {
        return HttpResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'name, email, specialty required' } }, { status: 400 });
      }
      const created = { id: genId('t'), name, email, specialty, createdAt: toISO(new Date()) };
      trainers.unshift(created);
      return HttpResponse.json(created, { status: 201 });
    }),

    http.get(/\/trainers\/[^/]+$/, async ({ request }) => {
      await delay(120);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const t = trainers.find((x) => x.id === id);
      if (!t) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      return HttpResponse.json(t, { status: 200 });
    }),

    http.patch(/\/trainers\/[^/]+$/, async ({ request }) => {
      await delay(120);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const idx = trainers.findIndex((x) => x.id === id);
      if (idx === -1) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      const patch = await request.json();
      trainers[idx] = { ...trainers[idx], ...patch };
      return HttpResponse.json(trainers[idx], { status: 200 });
    }),

    http.delete(/\/trainers\/[^/]+$/, async ({ request }) => {
      await delay(100);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const before = trainers.length;
      trainers = trainers.filter((t) => t.id !== id);
      if (trainers.length === before) {
        return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      }
      return new HttpResponse(null, { status: 204 });
    }),
  ];

  // Classes CRUD
  const classHandlers = [
    http.get(endpoints.classes.list, async ({ request, request: { url } }) => {
      await delay(160);
      // classes reading is allowed for everyone in contract; keep simple
      const u = new URL(url);
      const q = u.searchParams.get('q') || '';
      const trainerId = u.searchParams.get('trainerId') || '';
      const page = u.searchParams.get('page') || '1';
      const limit = u.searchParams.get('limit') || '20';

      let list = [...classes];
      if (q) {
        const lc = q.toLowerCase();
        list = list.filter((c) => c.title.toLowerCase().includes(lc) || String(c.trainer || '').toLowerCase().includes(lc));
      }
      if (trainerId) list = list.filter((c) => c.trainerId === trainerId);
      return HttpResponse.json(withPagination(list, page, limit), { status: 200 });
    }),

    http.post(endpoints.classes.list, async ({ request }) => {
      await delay(180);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const body = await request.json();
      const { title, trainerId, trainer, capacity = 10, scheduledAt } = body || {};
      if (!title || (!trainerId && !trainer)) {
        return HttpResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'title and trainer or trainerId required' } }, { status: 400 });
      }
      const resolvedTrainerName =
        trainer || trainers.find((t) => t.id === trainerId)?.name || 'TBD';
      const created = {
        id: genId('c'),
        title,
        trainerId: trainerId || null,
        trainer: resolvedTrainerName,
        capacity: Number(capacity) || 0,
        scheduledAt: scheduledAt ? toISO(scheduledAt) : null,
        createdAt: toISO(new Date()),
      };
      classes.unshift(created);
      return HttpResponse.json(created, { status: 201 });
    }),

    http.get(/\/classes\/[^/]+$/, async ({ request }) => {
      await delay(100);
      const id = request.url.split('/').pop();
      const c = classes.find((x) => x.id === id);
      if (!c) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      return HttpResponse.json(c, { status: 200 });
    }),

    http.patch(/\/classes\/[^/]+$/, async ({ request }) => {
      await delay(120);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const idx = classes.findIndex((x) => x.id === id);
      if (idx === -1) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      const patch = await request.json();
      classes[idx] = { ...classes[idx], ...patch };
      return HttpResponse.json(classes[idx], { status: 200 });
    }),

    http.delete(/\/classes\/[^/]+$/, async ({ request }) => {
      await delay(100);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const before = classes.length;
      classes = classes.filter((c) => c.id !== id);
      if (classes.length === before) {
        return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      }
      return new HttpResponse(null, { status: 204 });
    }),
  ];

  // Bookings
  const bookingHandlers = [
    http.get('/bookings', async ({ request, request: { url } }) => {
      await delay(140);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const u = new URL(url);
      const page = u.searchParams.get('page') || '1';
      const limit = u.searchParams.get('limit') || '20';
      const status = u.searchParams.get('status') || '';
      const classId = u.searchParams.get('classId') || '';
      const memberId = u.searchParams.get('memberId') || '';

      let list = [...bookings];
      if (status) list = list.filter((b) => b.status === status);
      if (classId) list = list.filter((b) => b.classId === classId);
      if (memberId) list = list.filter((b) => b.memberId === memberId);

      return HttpResponse.json(withPagination(list, page, limit), { status: 200 });
    }),

    http.post('/bookings', async ({ request }) => {
      await delay(180);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const { classId } = (await request.json()) || {};
      if (!classId) {
        return HttpResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'classId required' } }, { status: 400 });
      }
      const cls = classes.find((c) => c.id === classId);
      if (!cls) {
        return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Class not found.' } }, { status: 404 });
      }
      const countForClass = bookings.filter((b) => b.classId === classId && b.status === 'confirmed').length;
      if (cls.capacity && countForClass >= cls.capacity) {
        return HttpResponse.json({ error: { code: 'CONFLICT', message: 'Capacity reached' } }, { status: 409 });
      }
      const memberId = members[0]?.id || 'm_demo';
      const created = {
        id: genId('b'),
        memberId,
        classId,
        status: 'confirmed',
        createdAt: toISO(new Date()),
      };
      bookings.unshift(created);
      return HttpResponse.json(created, { status: 201 });
    }),

    http.patch(/\/bookings\/[^/]+$/, async ({ request }) => {
      await delay(120);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const idx = bookings.findIndex((b) => b.id === id);
      if (idx === -1) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      const patch = await request.json();
      bookings[idx] = { ...bookings[idx], ...patch };
      return HttpResponse.json(bookings[idx], { status: 200 });
    }),
  ];

  // Programs CRUD
  const programHandlers = [
    http.get('/programs', async ({ request, request: { url } }) => {
      await delay(140);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const u = new URL(url);
      const page = u.searchParams.get('page') || '1';
      const limit = u.searchParams.get('limit') || '20';
      const trainerId = u.searchParams.get('trainerId') || '';
      const q = u.searchParams.get('q') || '';

      let list = [...programs];
      if (trainerId) list = list.filter((p) => p.trainerId === trainerId);
      if (q) {
        const lc = q.toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(lc));
      }
      return HttpResponse.json(withPagination(list, page, limit), { status: 200 });
    }),

    http.post('/programs', async ({ request }) => {
      await delay(160);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const { title, weeks = 4 } = (await request.json()) || {};
      if (!title) {
        return HttpResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'title required' } }, { status: 400 });
      }
      const trainerId = trainers[0]?.id || 't_demo';
      const created = {
        id: genId('pr'),
        title,
        weeks: Number(weeks) || 0,
        trainerId,
        createdAt: toISO(new Date()),
      };
      programs.unshift(created);
      return HttpResponse.json(created, { status: 201 });
    }),

    http.get(/\/programs\/[^/]+$/, async ({ request }) => {
      await delay(100);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const p = programs.find((x) => x.id === id);
      if (!p) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      return HttpResponse.json(p, { status: 200 });
    }),

    http.patch(/\/programs\/[^/]+$/, async ({ request }) => {
      await delay(120);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const idx = programs.findIndex((x) => x.id === id);
      if (idx === -1) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      const patch = await request.json();
      programs[idx] = { ...programs[idx], ...patch };
      return HttpResponse.json(programs[idx], { status: 200 });
    }),

    http.delete(/\/programs\/[^/]+$/, async ({ request }) => {
      await delay(100);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const before = programs.length;
      programs = programs.filter((p) => p.id !== id);
      if (programs.length === before) {
        return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      }
      return new HttpResponse(null, { status: 204 });
    }),
  ];

  // Payments
  const paymentHandlers = [
    http.get('/payments', async ({ request, request: { url } }) => {
      await delay(160);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const u = new URL(url);
      const page = u.searchParams.get('page') || '1';
      const limit = u.searchParams.get('limit') || '20';
      const memberId = u.searchParams.get('memberId') || '';
      const minAmount = Number(u.searchParams.get('minAmount') || '0');
      const maxAmountRaw = u.searchParams.get('maxAmount');
      const maxAmount = typeof maxAmountRaw === 'string' ? Number(maxAmountRaw) : undefined;

      let list = [...payments];
      if (memberId) list = list.filter((p) => p.memberId === memberId);
      if (!Number.isNaN(minAmount) && minAmount > 0) list = list.filter((p) => Number(p.amount) >= minAmount);
      if (typeof maxAmount !== 'undefined' && !Number.isNaN(maxAmount)) {
        list = list.filter((p) => Number(p.amount) <= maxAmount);
      }
      return HttpResponse.json(withPagination(list, page, limit), { status: 200 });
    }),

    http.post('/payments', async ({ request }) => {
      await delay(160);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const { memberId, amount, method = 'card', note } = (await request.json()) || {};
      if (!memberId || typeof amount === 'undefined') {
        return HttpResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'memberId and amount required' } }, { status: 400 });
      }
      const created = {
        id: genId('p'),
        memberId,
        amount: Number(amount) || 0,
        method,
        status: 'succeeded',
        date: toISO(new Date()),
        note: note || null,
      };
      payments.unshift(created);
      return HttpResponse.json(created, { status: 201 });
    }),

    http.get(/\/payments\/[^/]+$/, async ({ request }) => {
      await delay(120);
      if (!requireAuth(request)) {
        return HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token.' } }, { status: 401 });
      }
      const id = request.url.split('/').pop();
      const p = payments.find((x) => x.id === id);
      if (!p) return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }, { status: 404 });
      return HttpResponse.json(p, { status: 200 });
    }),
  ];

  return [
    ...authHandlers,
    ...memberHandlers,
    ...trainerHandlers,
    ...classHandlers,
    ...bookingHandlers,
    ...programHandlers,
    ...paymentHandlers,
  ];
}

export default buildHandlers;
