import { setupServer } from 'msw/node';
import { buildHandlers } from './handlers';

/**
 * PUBLIC_INTERFACE
 * server - MSW node server configured with our handlers.
 * Useful for unit tests that need request mocking without a browser.
 */
export const server = setupServer(...buildHandlers());
