 /**
  * PUBLIC_INTERFACE
  * API Endpoints map. Adjust paths as backend evolves.
  * Keep all route fragments here to ensure a single source of truth.
  */
const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  members: {
    list: '/members',
    detail: (id) => `/members/${id}`,
  },
  trainers: {
    list: '/trainers',
    detail: (id) => `/trainers/${id}`,
  },
  classes: {
    list: '/classes',
    detail: (id) => `/classes/${id}`,
    bookings: '/bookings',
  },
};

export default endpoints;
