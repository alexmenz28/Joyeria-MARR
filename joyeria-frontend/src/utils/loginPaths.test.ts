import { isStaffOnlyPath } from './loginPaths';

test('isStaffOnlyPath blocks admin routes', () => {
  expect(isStaffOnlyPath('/dashboard')).toBe(true);
  expect(isStaffOnlyPath('/admin/products')).toBe(true);
  expect(isStaffOnlyPath('/catalog')).toBe(false);
  expect(isStaffOnlyPath('/cart')).toBe(false);
});
