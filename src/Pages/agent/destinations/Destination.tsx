import { useEffect, useMemo, useState } from 'react';
import { Search, MoreVertical, MapPin, Trash2, Edit, Plus, ChevronLeft, ChevronRight, Globe, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../../api';
import type { Destination } from '../../../types/Destination-models';
import ConfirmDeleteModal from '../../../Components/common/ConfirmDeleteModal';
import { LoadingSpinner } from '../../../Components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Outlet, useNavigate } from 'react-router-dom';
import { DestinationContext } from './DestinationContext';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

function AgentDestinations() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<Set<string>>(new Set());

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    // Filter destinations based on search query
    const filtered = destinations.filter(destination =>
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDestinations(filtered);
    setCurrentPage(1);
  }, [searchQuery, destinations]);

  const selectedCount = selectedDestinations.size;

  const selectedIdsInFiltered = useMemo(() => {
    if (selectedDestinations.size === 0) return [];
    const filteredIds = new Set(filteredDestinations.map(d => String(d.id)));
    return Array.from(selectedDestinations).filter(id => filteredIds.has(id));
  }, [filteredDestinations, selectedDestinations]);

  const loadDestinations = async (silent = false) => {
    if (!silent) setLoading(true);

    const response = await api.destinations.getAllDestinations();

    if (!silent) setLoading(false);

    if (response.isSuccess && response.data) {
      setDestinations(response.data);
      setFilteredDestinations(response.data);
    } else {
      setDestinations([]);
      setFilteredDestinations([]);
      if (response?.message) {
        setError(response.message);
        toast.error(response.message);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const dest = destinations.find(d => String(d.id) === id);
    if (!dest) return;
    const newStatus = !dest.isActive;
    const response = await api.destinations.updateDestination(id, { isActive: newStatus });
    if (response.isSuccess) {
      const message = newStatus ? t('destinations.messages.activateSuccess') : t('destinations.messages.deactivateSuccess');
      toast.success(message);
      loadDestinations(true);
    } else {
      toast.error(response.message || t('destinations.messages.toggleError'));
    }
    setOpenDropdown(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/agent/destinations/${id}`);
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

  const handleSelectDestination = (id: string) => {
    const newSelected = new Set(selectedDestinations);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDestinations(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDestinations.size === currentDestinations.length) {
      setSelectedDestinations(new Set());
    } else {
      setSelectedDestinations(new Set(currentDestinations.map(d => String(d.id))));
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

    const response = await api.destinations.deleteDestination(id);

    setDeleteBusy(false);

    if (response.isSuccess) {
      const message = response?.message || t('destinations.messages.deleteSuccess');
      toast.success(message);
      setSelectedDestinations(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);
      setOpenDropdown(null);
      await loadDestinations();
    } else {
      const errorMessage = response?.message || t('destinations.messages.deleteError');
      toast.error(errorMessage);
    }
  };

  const deleteMany = async (ids: string[]) => {
    setDeleteBusy(true);

    const response = await api.destinations.deleteDestinations(ids);

    setDeleteBusy(false);

    if (response.isSuccess) {
      const message = response?.message || t('destinations.messages.deleteManySuccess');
      toast.success(message);
      setSelectedDestinations(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);
      setOpenDropdown(null);
      await loadDestinations();
    } else {
      const errorMessage = response?.message || t('destinations.messages.deleteManyError');
      toast.error(errorMessage);
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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredDestinations.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDestinations = filteredDestinations.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('destinations.title')}
        </h1>
        <div className="hidden md:flex items-center gap-3">
          {selectedCount > 0 && (
            <button
              onClick={requestBulkDelete}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title={t('destinations.delete')}
            >
              <Trash2 className="w-4 h-4" />
              {t('destinations.deleteSelected', { count: selectedCount })}
            </button>
          )}

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('destinations.create.title')}
          </button>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('destinations.search')}
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
            placeholder={t('destinations.search')}
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
          {t('destinations.create.title')}
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto md:overflow-hidden px-4 py-4 pb-24 md:pb-20">
        {error && (
          <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {filteredDestinations.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <MapPin className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('destinations.noDestinations')}</p>
            {searchQuery && (
              <p className="text-sm mt-2">{t('destinations.modifySearch')}</p>
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
                            checked={selectedDestinations.size === currentDestinations.length && currentDestinations.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('destinations.columns.name')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('destinations.columns.country')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('destinations.columns.city')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('destinations.columns.status')}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('destinations.columns.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-16 text-center">
                            <div className="flex justify-center items-center">
                              <LoadingSpinner />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentDestinations.map((destination) => (
                          <tr key={destination.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={selectedDestinations.has(String(destination.id))}
                                onChange={() => handleSelectDestination(String(destination.id))}
                                className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                {destination.imageUrl && (
                                  <img
                                    src={destination.imageUrl}
                                    alt={destination.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {destination.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {destination.country}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {destination.city}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(destination.isActive)}`}>
                                {destination.isActive ? t('destinations.status.active') : t('destinations.status.inactive')}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end items-center">
                                <button
                                  onClick={(e) => toggleDropdown(String(destination.id), e)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                                >
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              </div>
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
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                currentDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                          {destination.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {destination.city}, {destination.country}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === String(destination.id) ? null : String(destination.id))}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openDropdown === String(destination.id) && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <button
                              onClick={() => handleToggleStatus(String(destination.id))}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                            >
                              {destination.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              {destination.isActive ? t('destinations.actions.deactivate') : t('destinations.actions.activate')}
                            </button>
                            <button
                              onClick={() => handleEdit(String(destination.id))}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              {t('destinations.actions.edit')}
                            </button>
                            <button
                              onClick={() => requestDeleteOne(String(destination.id))}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('destinations.actions.delete')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {destination.imageUrl && (
                        <img
                          src={destination.imageUrl}
                          alt={destination.name}
                          className="w-full h-32 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {destination.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {destination.city}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(destination.isActive)}`}>
                        {destination.isActive ? t('destinations.status.active') : t('destinations.status.inactive')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Pagination Footer - Fixed at bottom */}
      {filteredDestinations.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-auto md:right-auto md:relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg md:shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center justify-between max-w-full">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('destinations.pagination.showing')} <span className="font-semibold">{pageSize}</span> {t('destinations.pagination.perPage')}
              <span className="hidden md:inline ml-2 text-gray-500 dark:text-gray-400">
                ({filteredDestinations.length} {t(filteredDestinations.length > 1 ? 'destinations.pagination.results_plural' : 'destinations.pagination.results')})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
                  setCurrentPage(1);
                }}
                className="h-9 px-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="p-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t('destinations.pagination.previous')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t('destinations.pagination.next')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown global - positionné en fixed pour sortir de l'overflow */}
      {openDropdown && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpenDropdown(null)}
          />
          <div
            className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-40 w-48"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`
            }}
          >
            <button
              onClick={() => handleToggleStatus(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
            >
              {destinations.find(d => String(d.id) === openDropdown)?.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {destinations.find(d => String(d.id) === openDropdown)?.isActive ? t('destinations.actions.deactivate') : t('destinations.actions.activate')}
            </button>
            <button
              onClick={() => handleEdit(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              {t('destinations.actions.edit')}
            </button>
            <button
              onClick={() => requestDeleteOne(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
            >
              <Trash2 className="w-4 h-4" />
              {t('destinations.actions.delete')}
            </button>
          </div>
        </>
      )}

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => {
          if (deleteBusy) return;
          setConfirmDeleteOpen(false);
          setDeleteTargetIds([]);
        }}
        onConfirm={onConfirmDelete}
        entityLabel={t(deleteTargetIds.length > 1 ? 'entities.destinations' : 'entities.destination')}
        count={deleteTargetIds.length}
        loading={deleteBusy}
      />

      {/* Child route renders the drawer or modal */}
      <DestinationContext.Provider value={{ reloadDestinations: () => loadDestinations(true) }}>
        <Outlet context={{ createModalOpen, setCreateModalOpen }} />
      </DestinationContext.Provider>
    </div>
  );
}

export default AgentDestinations;
