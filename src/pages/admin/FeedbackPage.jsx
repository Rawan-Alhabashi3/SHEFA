import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/admin/StatusBadge';
import { getAdminFeedback, updateFeedback, deleteFeedback } from '../../services/feedbackService';

function AdminFeedbackPage() {
  const { t } = useTranslation("admin");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ last_page: 1, total: 0 });
  const [notice, setNotice] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminFeedback({
        page,
        per_page: 15,
        search,
        type: typeFilter,
        status: statusFilter,
      });
      setRows(response?.data?.data || []);
      setMeta({
        last_page: response?.data?.last_page || 1,
        total: response?.data?.total || 0,
      });
    } catch (err) {
      setError(err?.response?.data?.message || t('common.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, typeFilter, statusFilter]);

  const onSearch = async (event) => {
    event.preventDefault();
    setPage(1);
    loadData();
  };

  const onDelete = async (id) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    await deleteFeedback(id);
    setNotice(t('common.itemDeleted'));
    await loadData();
  };

  const onStatusChange = async (id, newStatus) => {
    await updateFeedback(id, { status: newStatus });
    setNotice(t('common.itemUpdated'));
    await loadData();
  };

  const columns = [
    { key: 'id', label: t('feedback.columns.id') },
    { key: 'name', label: t('feedback.columns.name') },
    { key: 'email', label: t('feedback.columns.email') },
    {
      key: 'type',
      label: t('feedback.columns.type'),
      badge: true,
      badgeLabelKey: 'feedbackTypes',
      badgeNs: 'admin',
      badgeValue: (row) => row.type,
    },
    { key: 'subject', label: t('feedback.columns.subject') },
    {
      key: 'rating',
      label: t('feedback.columns.rating'),
      render: (row) => (row.rating ? `${row.rating}/5` : '-'),
    },
    {
      key: 'status',
      label: t('feedback.columns.status'),
      badge: true,
      badgeLabelKey: 'feedbackStatuses',
      badgeNs: 'admin',
      badgeValue: (row) => row.status,
    },
    {
      key: 'created_at',
      label: t('feedback.columns.createdAt'),
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  const statusOptions = [
    { value: 'pending', label: t('feedback.statuses.pending') },
    { value: 'in_review', label: t('feedback.statuses.inReview') },
    { value: 'resolved', label: t('feedback.statuses.resolved') },
    { value: 'published', label: t('feedback.statuses.published') },
    { value: 'rejected', label: t('feedback.statuses.rejected') },
  ];

  const typeOptions = [
    { value: 'all', label: t('common.all') },
    { value: 'feedback', label: t('feedback.types.feedback') },
    { value: 'complaint', label: t('feedback.types.complaint') },
    { value: 'suggestion', label: t('feedback.types.suggestion') },
    { value: 'support_issue', label: t('feedback.types.supportIssue') },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('feedback.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('feedback.description')}
        </p>
      </div>

      <Card className="p-4">
        <form onSubmit={onSearch} className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('common.search')}
            className="h-10 min-w-[220px] rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="theme-select"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="theme-select"
          >
            <option value="all">{t('common.allStatuses')}</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button type="submit" className="!rounded-xl px-4 py-2">
            {t('common.searchButton')}
          </Button>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('common.total')}: {meta.total}
          </span>
        </form>
      </Card>

      {notice ? (
        <p className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-200">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title={t('common.noRecordsFound')}
              description={t('common.tryDifferentFilters')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-start text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="px-4 py-3">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    {columns.map((column) => {
                      const rawValue = column.badgeValue
                        ? column.badgeValue(row)
                        : row[column.badgeKey || column.key];
                      const value = column.render
                        ? column.render(row)
                        : row[column.key];
                      return (
                        <td key={column.key} className="px-4 py-3 align-top">
                          {column.badge ? (
                            <StatusBadge
                              value={rawValue ?? value}
                              ns={column.badgeNs || 'common'}
                              labelKey={column.badgeLabelKey || 'statusLabels'}
                            />
                          ) : (
                            value ?? '-'
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <select
                          value={row.status}
                          onChange={(e) => onStatusChange(row.id, e.target.value)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-slate-900 dark:text-slate-100"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => onDelete(row.id)}
                          className="rounded-lg bg-rose-50 dark:bg-rose-950/40 px-2 py-1 text-xs font-semibold text-rose-700 dark:text-rose-200 hover:bg-rose-100"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm"
          disabled={page <= 1}
        >
          {t('common.prev')}
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {page} / {meta.last_page}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(meta.last_page, prev + 1))}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm"
          disabled={page >= meta.last_page}
        >
          {t('common.next')}
        </button>
      </div>
    </section>
  );
}

export default AdminFeedbackPage;
