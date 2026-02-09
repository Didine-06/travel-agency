import { useEffect, useMemo, useState } from 'react';
import { Search, MoreVertical, Package, Trash2, Edit, Plus, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../../api';
import type { PackageResponse } from '../../../types/Package-models';
import ConfirmDeleteModal from '../../../Components/common/ConfirmDeleteModal';
import { LoadingSpinner } from '../../../Components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Outlet, useNavigate } from 'react-router-dom';
import { PackageContext } from './PackageContext';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

function AgentPackages() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [packages, setPackages] = useState<PackageResponse[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    const filtered = packages.filter(pkg =>
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination?.country?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPackages(filtered);
    setCurrentPage(1);
  }, [searchQuery, packages]);

  const selectedCount = selectedPackages.size;

  const selectedIdsInFiltered = useMemo(() => {
    if (selectedPackages.size === 0) return [];
    const filteredIds = new Set(filteredPackages.map(p => String(p.id)));
    return Array.from(selectedPackages).filter(id => filteredIds.has(id));
  }, [filteredPackages, selectedPackages]);

  const loadPackages = async (silent = false) => {
    if (!silent) setLoading(true);

    const response = await api.agentPackages.getAll();

    if (!silent) setLoading(false);

    if (response.isSuccess && response.data) {
      setPackages(response.data);
      setFilteredPackages(response.data);
    } else {
      setPackages([]);
      setFilteredPackages([]);
      if (response?.message) {
        setError(response.message);
        toast.error(response.message);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const pkg = packages.find(p => String(p.id) === id);
    if (!pkg) return;
    const newStatus = !pkg.isActive;
    const response = await api.agentPackages.update(id, { isActive: newStatus });
    if (response.isSuccess) {
      const message = newStatus ? t('agentPackages.messages.activateSuccess') : t('agentPackages.messages.deactivateSuccess');
      toast.success(message);
      loadPackages(true);
    } else {
      toast.error(response.message || t('agentPackages.messages.toggleError'));
    }
    setOpenDropdown(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/agent/packages/${id}`);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right
      });
      setOpenDropdown(id);
    }
  };

  const handleSelectPackage = (id: string) => {
    const newSelected = new Set(selectedPackages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPackages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPackages.size === currentPackages.length) {
      setSelectedPackages(new Set());
    } else {
      setSelectedPackages(new Set(currentPackages.map(p => String(p.id))));
    }
  };

  const requestBulkDelete = () => {
    if (selectedIdsInFiltered.length === 0) return;
    setDeleteTargetIds(selectedIdsInFiltered);
    setConfirmDeleteOpen(true);
    setOpenDropdown(null);
  };

  const requestDeleteOne = (id: string) => {
    setDeleteTargetIds([id]);
    setConfirmDeleteOpen(true);
    setOpenDropdown(null);
  };

  const deleteOne = async (id: string) => {
    setDeleteBusy(true);
    const response = await api.agentPackages.delete(id);
    setDeleteBusy(false);

    if (response.isSuccess) {
      toast.success(response.message || t('agentPackages.messages.deleteSuccess'));
      setSelectedPackages(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);
      setOpenDropdown(null);
      await loadPackages();
    } else {
      toast.error(response.message || t('agentPackages.messages.deleteError'));
    }
  };

  const deleteMany = async (ids: string[]) => {
    setDeleteBusy(true);
    const response = await api.agentPackages.deleteMany(ids);
    setDeleteBusy(false);

    if (response.isSuccess) {
      toast.success(response.message || t('agentPackages.messages.deleteManySuccess'));
      setSelectedPackages(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);
      setOpenDropdown(null);
      await loadPackages();
    } else {
      toast.error(response.message || t('agentPackages.messages.deleteManyError'));
    }
  };

  const onConfirmDelete = async () => {
    if (deleteTargetIds.length === 0) return;
    if (deleteTargetIds.length === 1) return deleteOne(deleteTargetIds[0]);
    return deleteMany(deleteTargetIds);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const formatDate = (dateStr: string) => {
    const locale = i18n.language === 'fr' ? fr : enUS;
    return format(new Date(dateStr), 'dd MMM yyyy', { locale });
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPackages.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPackages = filteredPackages.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('agentPackages.title')}
        </h1>
        <div className="hidden md:flex items-center gap-3">
          {selectedCount > 0 && (
            <button
              onClick={requestBulkDelete}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t('agentPackages.deleteSelected', { count: selectedCount })}
            </button>
          )}

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('agentPackages.create.title')}
          </button>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('agentPackages.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-20 space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={t('agentPackages.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('agentPackages.create.title')}
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto md:overflow-hidden px-4 py-4 pb-24 md:pb-20">
        {error && (
          <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {filteredPackages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('agentPackages.noPackages')}</p>
            {searchQuery && (
              <p className="text-sm mt-2">{t('agentPackages.modifySearch')}</p>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left w-12 bg-gray-100 dark:bg-gray-800">
                          <input
                            type="checkbox"
                            checked={selectedPackages.size === currentPackages.length && currentPackages.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.title')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.destination')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.duration')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.price')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.capacity')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.availableFrom')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.availableTo')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.status')}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">{t('agentPackages.columns.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr><td colSpan={10} className="px-4 py-16 text-center"><div className="flex justify-center items-center"><LoadingSpinner /></div></td></tr>
                      ) : (
                        currentPackages.map((pkg) => (
                          <tr key={pkg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={selectedPackages.has(String(pkg.id))}
                                onChange={() => handleSelectPackage(String(pkg.id))}
                                className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{pkg.title}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{pkg.destination?.name}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{pkg.duration} {t('agentPackages.days')}</td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{pkg.price} DZD</td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{pkg.maxCapacity}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{formatDate(pkg.availableFrom)}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{formatDate(pkg.availableTo)}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pkg.isActive)}`}>
                                {pkg.isActive ? t('agentPackages.status.active') : t('agentPackages.status.inactive')}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button
                                onClick={(e) => toggleDropdown(String(pkg.id), e)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>
              ) : (
                currentPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">{pkg.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pkg.destination?.name}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === String(pkg.id) ? null : String(pkg.id))}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openDropdown === String(pkg.id) && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <button
                              onClick={() => handleToggleStatus(String(pkg.id))}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                            >
                              {pkg.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              {pkg.isActive ? t('agentPackages.actions.deactivate') : t('agentPackages.actions.activate')}
                            </button>
                            <button
                              onClick={() => handleEdit(String(pkg.id))}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              {t('agentPackages.actions.edit')}
                            </button>
                            <button
                              onClick={() => requestDeleteOne(String(pkg.id))}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('agentPackages.actions.delete')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">{t('agentPackages.columns.duration')}</span><span className="text-gray-900 dark:text-gray-100">{pkg.duration} {t('agentPackages.days')}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">{t('agentPackages.columns.price')}</span><span className="font-medium text-gray-900 dark:text-gray-100">{pkg.price} DZD</span></div>
                      <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">{t('agentPackages.columns.capacity')}</span><span className="text-gray-900 dark:text-gray-100">{pkg.maxCapacity}</span></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pkg.isActive)}`}>
                        {pkg.isActive ? t('agentPackages.status.active') : t('agentPackages.status.inactive')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredPackages.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-auto md:right-auto md:relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg md:shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center justify-between max-w-full">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('agentPackages.pagination.showing')} <span className="font-semibold">{pageSize}</span> {t('agentPackages.pagination.perPage')}
              <span className="hidden md:inline ml-2 text-gray-500 dark:text-gray-400">
                ({filteredPackages.length} {t(filteredPackages.length > 1 ? 'agentPackages.pagination.results_plural' : 'agentPackages.pagination.results')})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]); setCurrentPage(1); }} className="h-9 px-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {PAGE_SIZE_OPTIONS.map((size) => (<option key={size} value={size}>{size}</option>))}
              </select>
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={safeCurrentPage === 1} className="p-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title={t('agentPackages.pagination.previous')}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={safeCurrentPage === totalPages} className="p-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title={t('agentPackages.pagination.next')}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown global */}
      {openDropdown && (
        <>
          <div className="fixed inset-0 z-30 hidden md:block" onClick={() => setOpenDropdown(null)} />
          <div className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-40 w-48 hidden md:block" style={{ top: `${dropdownPosition.top}px`, right: `${dropdownPosition.right}px` }}>
            <button
              onClick={() => handleToggleStatus(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
            >
              {packages.find(p => String(p.id) === openDropdown)?.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {packages.find(p => String(p.id) === openDropdown)?.isActive ? t('agentPackages.actions.deactivate') : t('agentPackages.actions.activate')}
            </button>
            <button
              onClick={() => handleEdit(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              {t('agentPackages.actions.edit')}
            </button>
            <button
              onClick={() => requestDeleteOne(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
            >
              <Trash2 className="w-4 h-4" />
              {t('agentPackages.actions.delete')}
            </button>
          </div>
        </>
      )}

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => { if (deleteBusy) return; setConfirmDeleteOpen(false); setDeleteTargetIds([]); }}
        onConfirm={onConfirmDelete}
        entityLabel={t(deleteTargetIds.length > 1 ? 'entities.packages' : 'entities.package')}
        count={deleteTargetIds.length}
        loading={deleteBusy}
      />

      <PackageContext.Provider value={{ reloadPackages: () => loadPackages(true) }}>
        <Outlet context={{ createModalOpen, setCreateModalOpen }} />
      </PackageContext.Provider>
    </div>
  );
}

export default AgentPackages;
