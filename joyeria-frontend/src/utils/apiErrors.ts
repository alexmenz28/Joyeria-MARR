import axios from 'axios';

type ApiErrorBody = {
  error?: string;
  message?: string;
  title?: string;
  code?: string;
};

/** Reads server error text from axios errors ({ error } or legacy { message }). */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | string | undefined;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      const msg = data.error ?? data.message ?? data.title;
      if (typeof msg === 'string' && msg.trim()) return msg;
    }
    if (err.response?.status === 401) return 'Session expired. Please sign in again.';
    if (err.response?.status === 403) return 'You do not have permission for this action.';
    if (err.response?.status === 429) return 'Too many attempts. Please wait a moment and try again.';
    if (!err.response) return 'Could not reach the API. Check that the backend is running.';
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
