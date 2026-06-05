import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { Check, X, Eye, Search, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import apiClient from '../../services/apiClient';

function PharmacyApplicationsPage() {
  const { t } = useTranslation("admin");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [governorateFilter, setGovernorateFilter] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const governorates = ['Damascus', 'Aleppo', 'Homs', 'Hama', 'Lattakia', 'Tartous', 'Daraa', 'Deir ez-Zor', 'Hasakah', 'Raqqa', 'Suwayda', 'Quneitra', 'Rif Dimashq'];

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (governorateFilter) params.governorate = governorateFilter;

      const response = await apiClient.get('/admin/pharmacy-applications', { params });
      // Laravel paginator returns { data: { data: [...items], ... }, message, code }
      const paginator = response.data?.data;
      const data = paginator?.data || [];
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/pharmacy-stats');
      setStats(response.data || { pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [search, governorateFilter]);

  const handleApprove = async (pharmacyId) => {
    try {
      await apiClient.post('/admin/pharmacy-applications/approve', { pharmacy_id: pharmacyId });
      fetchApplications();
      fetchStats();
      if (showModal) {
        setShowModal(false);
        setSelectedApplication(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to approve pharmacy');
    }
  };

  const handleReject = async (pharmacyId) => {
    try {
      await apiClient.post('/admin/pharmacy-applications/reject', { pharmacy_id: pharmacyId });
      fetchApplications();
      fetchStats();
      if (showModal) {
        setShowModal(false);
        setSelectedApplication(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reject pharmacy');
    }
  };

  const viewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Pharmacy Applications</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review and manage pharmacy registration requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 ring-1 ring-slate-200 dark:ring-slate-700/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending</p>
          <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">{stats.pending}</p>
        </Card>
        <Card className="p-4 ring-1 ring-slate-200 dark:ring-slate-700/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Approved</p>
          <p className="mt-2 text-2xl font-extrabold text-green-600 dark:text-green-400">{stats.approved}</p>
        </Card>
        <Card className="p-4 ring-1 ring-slate-200 dark:ring-slate-700/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Rejected</p>
          <p className="mt-2 text-2xl font-extrabold text-rose-600 dark:text-rose-400">{stats.rejected}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <select
              value={governorateFilter}
              onChange={(e) => setGovernorateFilter(e.target.value)}
              className="theme-select"
            >
              <option value="">All Governorates</option>
              {governorates.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {error}
        </div>
      )}

      {/* Applications List */}
      <Card className="overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No pending pharmacy applications found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((app) => (
              <div key={app.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{app.pharmacy_name}</h3>
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        Pending
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      <p>Owner: {app.user?.username} ({app.user?.email})</p>
                      <p>Phone: {app.phone || app.user?.phone || 'N/A'}</p>
                      <p>Location: {app.governorate} {app.area ? `/ ${app.area}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewDetails(app)}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApprove(app.id)}
                    >
                      <Check size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(app.id)}
                    >
                      <X size={16} className="mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedApplication.pharmacy_name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Owner Information</h3>
                  <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p><span className="font-medium">Name:</span> {selectedApplication.user?.username}</p>
                    <p><span className="font-medium">Email:</span> {selectedApplication.user?.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedApplication.phone || selectedApplication.user?.phone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pharmacy Details</h3>
                  <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p><span className="font-medium">Governorate:</span> {selectedApplication.governorate}</p>
                    <p><span className="font-medium">Area:</span> {selectedApplication.area || 'N/A'}</p>
                    <p><span className="font-medium">Address:</span> {selectedApplication.address || 'N/A'}</p>
                    <p><span className="font-medium">Specialist:</span> {selectedApplication.is_specialist ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {selectedApplication.license_image && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">License Document</h3>
                    <div className="mt-2">
                      <img
                        src={selectedApplication.license_image}
                        alt="License"
                        className="max-h-64 rounded-lg border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                )}

                {selectedApplication.storefront_image && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Storefront Image</h3>
                    <div className="mt-2">
                      <img
                        src={selectedApplication.storefront_image}
                        alt="Storefront"
                        className="max-h-64 rounded-lg border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Registration Date</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(selectedApplication.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="success"
                    className="flex-1"
                    onClick={() => handleApprove(selectedApplication.id)}
                  >
                    <Check size={16} className="mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleReject(selectedApplication.id)}
                  >
                    <X size={16} className="mr-2" />
                    Reject Application
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default PharmacyApplicationsPage;
