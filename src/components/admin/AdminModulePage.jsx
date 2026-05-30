import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../common/Card';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import StatusBadge from './StatusBadge';
import { createAdminResource, deleteAdminResource, getAdminResourceList, updateAdminResource } from '../../services/adminService';
function AdminModulePage({
  title,
  description,
  resource,
  columns,
  quickCreate = null,
  editableFields = []
}) {
  const {
    t
  } = useTranslation("admin");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    last_page: 1,
    total: 0
  });
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(quickCreate || {});
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminResourceList(resource, {
        page,
        per_page: 10,
        search
      });
      setRows(response?.data?.data || []);
      setMeta({
        last_page: response?.data?.last_page || 1,
        total: response?.data?.total || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || t('common.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [page, search]);
  const onSearch = async event => {
    event.preventDefault();
    setPage(1);
  };
  const onDelete = async id => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    await deleteAdminResource(resource, id);
    setNotice(t('common.itemDeleted'));
    await loadData();
  };
  const onQuickUpdate = async (id, field, value) => {
    await updateAdminResource(resource, id, {
      [field]: value
    });
    setNotice(t('common.itemUpdated'));
    await loadData();
  };
  const onCreate = async event => {
    event.preventDefault();
    await createAdminResource(resource, form);
    setNotice(t('common.itemCreated'));
    setForm(quickCreate || {});
    await loadData();
  };
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      <Card className="p-4">
        <form onSubmit={onSearch} className="flex flex-wrap items-center gap-2">
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('common.search')} className="h-10 min-w-[220px] rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" />
          <Button type="submit" className="!rounded-xl px-4 py-2">{t('common.searchButton')}</Button>
          <span className="ms-auto text-xs font-medium text-slate-500 dark:text-slate-400">{t('common.total')}{meta.total}</span>
        </form>
      </Card>

      {quickCreate ? <Card className="p-4">
          <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-3">
            {Object.keys(quickCreate).map(field => <input key={field} value={form[field] ?? ''} onChange={event => setForm(prev => ({
          ...prev,
          [field]: event.target.value
        }))} placeholder={field} className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" />)}
            <Button type="submit" className="!rounded-xl px-4 py-2">{t('common.create')}</Button>
          </form>
        </Card> : null}

      {notice ? <p className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-200">{notice}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

      <Card className="overflow-hidden">
        {loading ? <div className="flex justify-center p-8"><Loader /></div> : rows.length === 0 ? <div className="p-6"><EmptyState title={t('common.noRecordsFound')} description={t('common.tryDifferentFilters')} /></div> : <div className="overflow-x-auto">
            <table className="min-w-full text-start text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr>
                  {columns.map(column => <th key={column.key} className="px-4 py-3">{column.label}</th>)}
                  <th className="px-4 py-3">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => <tr key={row.id} className="border-t border-slate-100 dark:border-slate-800">
                    {columns.map(column => {
                const value = column.render ? column.render(row) : row[column.key];
                return <td key={column.key} className="px-4 py-3 align-top">
                          {column.badge ? <StatusBadge value={value} /> : value ?? '-'}
                        </td>;
              })}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {editableFields.map(field => <button key={field.name} type="button" onClick={() => onQuickUpdate(row.id, field.name, field.nextValue(row))} className="rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-950 dark:bg-blue-950">
                            {field.label}
                          </button>)}
                        <button type="button" onClick={() => onDelete(row.id)} className="rounded-lg bg-rose-50 dark:bg-rose-950/40 px-2 py-1 text-xs font-semibold text-rose-700 dark:text-rose-200 hover:bg-rose-100">
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}
      </Card>

      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={() => setPage(prev => Math.max(1, prev - 1))} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm" disabled={page <= 1}>{t('common.prev')}</button>
        <span className="text-sm text-slate-500 dark:text-slate-400">{page} / {meta.last_page}</span>
        <button type="button" onClick={() => setPage(prev => Math.min(meta.last_page, prev + 1))} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm" disabled={page >= meta.last_page}>
          {t('common.next')}
        </button>
      </div>
    </section>;
}
export default AdminModulePage;