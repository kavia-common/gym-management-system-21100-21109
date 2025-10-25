import { setupWorker } from 'msw/browser';
import { buildHandlers } from './handlers';

/**
 * PUBLIC_INTERFACE
 * worker - MSW browser worker configured with our handlers.
 */
export const worker = setupWorker(...buildHandlers());
