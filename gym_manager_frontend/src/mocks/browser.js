import { setupWorker } from 'msw/browser';
import { buildHandlers } from './handlers';

/**
 * PUBLIC_INTERFACE
 * worker - MSW browser worker configured with our handlers.
 * NOTE: This module is only dynamically imported when REACT_APP_USE_MOCKS === 'true'.
 */
export const worker = setupWorker(...buildHandlers());
