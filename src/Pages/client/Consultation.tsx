import { useEffect, useMemo, useState } from 'react';
import { Search, MoreVertical, Calendar, Clock, Trash2, Edit, X, ChevronLeft, ChevronRight, User, MessageSquare } from 'lucide-react';
import { api } from '../../api';
import type { Consultation, ConsultationStatus } from '../../types/consultation-models';
import ConfirmDeleteModal from '../../Components/common/ConfirmDeleteModal';
import ConfirmCancelModal from '../../Components/common/ConfirmCancelModal';
import { LoadingSpinner } from '../../Components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Outlet, useNavigate } from 'react-router-dom';
import { ConsultationContext } from './consultations/ConsultationContext';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

function ClientConsultation() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedConsultations, setSelectedConsultations] = useState<Set<string>>(new Set());

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    // Filter consultations based on search query
    if (!Array.isArray(consultations)) {
      setFilteredConsultations([]);
      return;
    }
    
    const filtered = consultations.filter(consultation => {
      const searchLower = searchQuery.toLowerCase();
      return (
        consultation.subject.toLowerCase().includes(searchLower) ||
        consultation.description?.toLowerCase().includes(searchLower) ||
        consultation.status.toLowerCase().includes(searchLower) ||
        consultation.agent?.user?.firstName?.toLowerCase().includes(searchLower) ||
        consultation.agent?.user?.lastName?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredConsultations(filtered);
    setCurrentPage(1);
  }, [searchQuery, consultations]);

  const selectedCount = selectedConsultations.size;

  const selectedIdsInFiltered = useMemo(() => {
    if (selectedConsultations.size === 0) return [];
    const filteredIds = new Set(filteredConsultations.map(c => String(c.id)));
    return Array.from(selectedConsultations).filter(id => filteredIds.has(id));
  }, [filteredConsultations, selectedConsultations]);

  const loadConsultations = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.consultations.getMyConsultations();
      if (response.isSuccess && response.data) {
        const consultationsData = Array.isArray(response.data) ? response.data : [];
        setConsultations(consultationsData);
        setFilteredConsultations(consultationsData);
      } else {
        setConsultations([]);
        setFilteredConsultations([]);
      }
    } catch (err) {
      setError(t('consultations.messages.loadError'));
      setConsultations([]);
      setFilteredConsultations([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const requestDeleteOne = (id: string) => {
    setDeleteTargetIds([id]);
    setConfirmDeleteOpen(true);
    setOpenDropdown(null);
  };

  const requestCancelOne = (id: string) => {
    setCancelTargetId(id);
    setConfirmCancelOpen(true);
    setOpenDropdown(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/client/consultations/${id}`);
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

  const handleSelectConsultation = (id: string) => {
    const newSelected = new Set(selectedConsultations);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedConsultations(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedConsultations.size === currentConsultations.length) {
      setSelectedConsultations(new Set());
    } else {
      setSelectedConsultations(new Set(currentConsultations.map(c => String(c.id))));
    }
  };

  const requestBulkDelete = () => {
    if (selectedIdsInFiltered.length === 0) return;
    setDeleteTargetIds(selectedIdsInFiltered);
    setConfirmDeleteOpen(true);
    setOpenDropdown(null);
  };

  const deleteOne = async (id: string) => {
    try {
      setDeleteBusy(true);
      const response = await api.consultations.deleteMyConsultation(id);
      setSelectedConsultations(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);

      if (response?.message) toast.success(response.message);
      else toast.success(t('consultations.messages.deleteSuccess'));

      await loadConsultations();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('consultations.messages.deleteError');
      setError(message);
      toast.error(message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const deleteMany = async (ids: string[]) => {
    try {
      setDeleteBusy(true);
      const response = await api.consultations.deleteMyConsultations(ids);
      setSelectedConsultations(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);

      if (response?.message) toast.success(response.message);
      else toast.success(t('consultations.messages.deleteSuccess'));

      await loadConsultations();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('consultations.messages.deleteError');
      setError(message);
      toast.error(message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const cancelConsultation = async (reason: string) => {
    if (!cancelTargetId) return;
    
    try {
      setCancelBusy(true);
      const response = await api.consultations.cancelMyConsultation(cancelTargetId, {
        cancellationReason: reason
      });

      setConfirmCancelOpen(false);
      setCancelTargetId(null);

      if (response?.data) toast.success(t('consultations.messages.cancelSuccess'));
      else toast.success(t('consultations.messages.cancelSuccess'));

      await loadConsultations();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('consultations.messages.cancelError');
      setError(message);
      toast.error(message);
    } finally {
      setCancelBusy(false);
    }
  };

  const onConfirmDelete = async () => {
    if (deleteTargetIds.length === 0) return;
    if (deleteTargetIds.length === 1) return deleteOne(deleteTargetIds[0]);
    return deleteMany(deleteTargetIds);
  };

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const canEdit = (consultation: Consultation) => {
    return consultation.status === 'PENDING' || consultation.status === 'CONFIRMED';
  };

  const canCancel = (consultation: Consultation) => {
    return consultation.status === 'PENDING' || consultation.status === 'CONFIRMED';
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredConsultations.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentConsultations = filteredConsultations.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('consultations.title')}
        </h1>
        <div className="hidden md:flex items-center gap-3">
          {selectedCount > 0 && (
            <button
              onClick={requestBulkDelete}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title={t('consultations.delete')}
            >
              <Trash2 className="w-4 h-4" />
              {t('consultations.deleteSelected', { count: selectedCount })}
            </button>
          )}

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('consultations.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={t('consultations.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto md:overflow-hidden px-4 py-4 pb-24 md:pb-20">
        {error && (
          <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {filteredConsultations.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('consultations.noConsultations')}</p>
            {searchQuery && (
              <p className="text-sm mt-2">{t('consultations.modifySearch')}</p>
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
                            checked={selectedConsultations.size === currentConsultations.length && currentConsultations.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('consultations.columns.subject')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('consultations.columns.agent')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('consultations.columns.consultationDate')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('consultations.columns.duration')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('consultations.columns.status')}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('consultations.columns.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-16 text-center">
                            <div className="flex justify-center items-center">
                              <LoadingSpinner />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentConsultations.map((consultation) => (
                          <tr key={consultation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={selectedConsultations.has(String(consultation.id))}
                                onChange={() => handleSelectConsultation(String(consultation.id))}
                                className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {consultation.subject}
                              </div>
                              {consultation.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {consultation.description}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {consultation.agent ? (
                                <div>
                                  <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {consultation.agent.user?.firstName} {consultation.agent.user?.lastName}
                                  </div>
                                  {consultation.agent.specialty && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {consultation.agent.specialty}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                                  {t('consultations.noAgent')}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {new Date(consultation.consultationDate).toLocaleString('fr-FR', {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {consultation.duration} {t('consultations.minutes')}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                                {consultation.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end items-center">
                                <button
                                  onClick={(e) => toggleDropdown(String(consultation.id), e)}
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
                currentConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                          {consultation.subject}
                        </h3>
                        {consultation.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {consultation.description}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === String(consultation.id) ? null : String(consultation.id))}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openDropdown === String(consultation.id) && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            {canEdit(consultation) && (
                              <button
                                onClick={() => handleEdit(String(consultation.id))}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                              >
                                <Edit className="w-4 h-4" />
                                {t('consultations.actions.edit')}
                              </button>
                            )}
                            {canCancel(consultation) && (
                              <button
                                onClick={() => requestCancelOne(String(consultation.id))}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                {t('consultations.actions.cancel')}
                              </button>
                            )}
                            <button
                              onClick={() => requestDeleteOne(String(consultation.id))}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('consultations.actions.delete')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        {consultation.agent ? (
                          <span className="text-gray-900 dark:text-gray-100">
                            {consultation.agent.user?.firstName} {consultation.agent.user?.lastName}
                            {consultation.agent.specialty && ` - ${consultation.agent.specialty}`}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            {t('consultations.noAgent')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {new Date(consultation.consultationDate).toLocaleString('fr-FR', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {consultation.duration} {t('consultations.minutes')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
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
      {filteredConsultations.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-auto md:right-auto md:relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg md:shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center justify-between max-w-full">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('consultations.pagination.showing')} <span className="font-semibold">{pageSize}</span> {t('consultations.pagination.perPage')}
              <span className="hidden md:inline ml-2 text-gray-500 dark:text-gray-400">
                ({filteredConsultations.length} {t(`consultations.pagination.${filteredConsultations.length > 1 ? 'results_plural' : 'results'}`)})
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
                title={t('consultations.pagination.previous')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t('consultations.pagination.next')}
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
            {canEdit(consultations.find(c => String(c.id) === openDropdown)!) && (
              <button
                onClick={() => handleEdit(openDropdown)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
              >
                <Edit className="w-4 h-4" />
                {t('consultations.actions.edit')}
              </button>
            )}
            {canCancel(consultations.find(c => String(c.id) === openDropdown)!) && (
              <button
                onClick={() => requestCancelOne(openDropdown)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
              >
                <X className="w-4 h-4" />
                {t('consultations.actions.cancel')}
              </button>
            )}
            <button
              onClick={() => requestDeleteOne(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
            >
              <Trash2 className="w-4 h-4" />
              {t('consultations.actions.delete')}
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
        entityLabel={t(deleteTargetIds.length > 1 ? 'entities.consultations' : 'entities.consultation')}
        count={deleteTargetIds.length}
        loading={deleteBusy}
      />

      <ConfirmCancelModal
        open={confirmCancelOpen}
        onClose={() => {
          if (cancelBusy) return;
          setConfirmCancelOpen(false);
          setCancelTargetId(null);
        }}
        onConfirm={cancelConsultation}
        entityLabel={t('entities.consultation')}
        loading={cancelBusy}
      />

      {/* Child route renders the drawer */}
      <ConsultationContext.Provider value={{ reloadConsultations: () => loadConsultations(true) }}>
        <Outlet />
      </ConsultationContext.Provider>
    </div>
  );
}

export default ClientConsultation;
