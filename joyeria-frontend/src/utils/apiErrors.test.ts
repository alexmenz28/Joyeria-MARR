jest.mock('axios', () => ({
  __esModule: true,
  default: {
    isAxiosError: (err: unknown) =>
      typeof err === 'object' && err !== null && (err as { isAxiosError?: boolean }).isAxiosError === true,
  },
}));

import { getApiErrorMessage } from './apiErrors';
import { getJwtRole, isAdminOrEmployee } from './jwtRole';

test('getApiErrorMessage reads error field from axios response', () => {
  const axiosErr = {
    isAxiosError: true,
    response: { status: 400, data: { error: 'Insufficient stock', code: 'BUSINESS_ERROR' } },
  };
  expect(getApiErrorMessage(axiosErr)).toBe('Insufficient stock');
});

test('getApiErrorMessage falls back to message', () => {
  const axiosErr = {
    isAxiosError: true,
    response: { status: 400, data: { message: 'Legacy error' } },
  };
  expect(getApiErrorMessage(axiosErr)).toBe('Legacy error');
});

test('jwtRole helpers', () => {
  expect(isAdminOrEmployee('Admin')).toBe(true);
  expect(isAdminOrEmployee('Customer')).toBe(false);
  expect(getJwtRole({ role: 'Employee' })).toBe('Employee');
});
