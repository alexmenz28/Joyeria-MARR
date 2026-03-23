import React, { useCallback, useEffect, useState } from 'react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import api from '../../utils/api';
import type { PagedResult, RoleOption, UserListItem } from '../../types';

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

function getErrorMessage(err: unknown): string {
  const ax = err as { response?: { data?: { message?: string; title?: string } } };
  const m = ax.response?.data?.message ?? ax.response?.data?.title;
  return typeof m === 'string' ? m : 'No se pudo completar la operación.';
}

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [data, setData] = useState<PagedResult<UserListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { roleId: number; isActive: boolean }>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    void (async () => {
      try {
        const { data: r } = await api.get<RoleOption[]>('/api/admin/roles');
        setRoles(r);
      } catch {
        setRoles([]);
      }
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get<PagedResult<UserListItem>>('/api/admin/users', {
        params: {
          page,
          pageSize: PAGE_SIZE,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
        },
      });
      setData(res);
      setDrafts({});
    } catch {
      setError('No se pudieron cargar los usuarios. Comprueba que tu sesión sea de administrador.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const draftFor = (u: UserListItem) => drafts[u.id] ?? { roleId: u.roleId, isActive: u.isActive };

  const setDraft = (u: UserListItem, patch: Partial<{ roleId: number; isActive: boolean }>) => {
    setDrafts((prev) => {
      const cur = prev[u.id] ?? { roleId: u.roleId, isActive: u.isActive };
      return { ...prev, [u.id]: { ...cur, ...patch } };
    });
  };

  const isDirty = (u: UserListItem) => {
    const d = draftFor(u);
    return d.roleId !== u.roleId || d.isActive !== u.isActive;
  };

  const saveRow = async (u: UserListItem) => {
    const d = draftFor(u);
    if (!isDirty(u)) return;
    setSavingId(u.id);
    setError(null);
    try {
      const body: { roleId?: number; isActive?: boolean } = {};
      if (d.roleId !== u.roleId) body.roleId = d.roleId;
      if (d.isActive !== u.isActive) body.isActive = d.isActive;
      await api.patch(`/api/admin/users/${u.id}`, body);
      await loadUsers();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="w-full min-h-screen bg-ivory dark:bg-night-900 transition-colors pt-24">
        <section className="relative h-40 flex items-center justify-center bg-gradient-to-br from-ivory via-white to-gold-50 dark:from-night-900 dark:via-night-800 dark:to-night-900 overflow-hidden px-6">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-marrGold">Gestión de usuarios</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">Rol y cuenta activa (solo administradores)</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-10 px-6 md:px-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-night-800 rounded-2xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
              <label className="flex-1 max-w-md">
                <span className="sr-only">Buscar</span>
                <input
                  type="search"
                  placeholder="Buscar por email o nombre…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gold-200/80 dark:border-gold-500/30 bg-ivory dark:bg-night-900 px-3 py-2 text-gray-900 dark:text-gray-100"
                />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gold-200/50 dark:border-gold-500/20 text-marrGold">
                    <th className="py-3 pr-4 font-semibold">Usuario</th>
                    <th className="py-3 pr-4 font-semibold">Email</th>
                    <th className="py-3 pr-4 font-semibold">Rol</th>
                    <th className="py-3 pr-4 font-semibold">Activo</th>
                    <th className="py-3 pr-4 font-semibold">Alta</th>
                    <th className="py-3 font-semibold w-28">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-marrGold animate-pulse">
                        Cargando…
                      </td>
                    </tr>
                  ) : data?.items.length ? (
                    data.items.map((u) => {
                      const d = draftFor(u);
                      const dirty = isDirty(u);
                      return (
                        <tr
                          key={u.id}
                          className="border-b border-gray-100 dark:border-gold-500/10 text-gray-800 dark:text-gray-200"
                        >
                          <td className="py-3 pr-4">
                            {u.firstName} {u.lastName}
                          </td>
                          <td className="py-3 pr-4 break-all">{u.email}</td>
                          <td className="py-3 pr-4">
                            <select
                              value={d.roleId}
                              onChange={(e) => setDraft(u, { roleId: Number(e.target.value) })}
                              className="rounded-md border border-gold-200/80 dark:border-gold-500/30 bg-white dark:bg-night-900 px-2 py-1"
                            >
                              {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="checkbox"
                              checked={d.isActive}
                              onChange={(e) => setDraft(u, { isActive: e.target.checked })}
                              className="h-4 w-4 rounded border-gold-300 text-marrGold"
                            />
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                          <td className="py-3">
                            <button
                              type="button"
                              disabled={!dirty || savingId === u.id}
                              onClick={() => void saveRow(u)}
                              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-gold-500 hover:bg-gold-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {savingId === u.id ? '…' : 'Guardar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No hay usuarios en esta página.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data && data.totalPages > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Página {data.page} de {data.totalPages} ({data.totalCount} usuarios)
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-gold-300 dark:border-gold-500/40 px-3 py-1 disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border border-gold-300 dark:border-gold-500/40 px-3 py-1 disabled:opacity-40"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default UserManagement;
