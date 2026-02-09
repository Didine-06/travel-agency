import { useEffect, useMemo, useState } from 'react';
import { Search, MoreVertical, MessageSquare, ChevronLeft, ChevronRight, UserPlus, CheckCircle } from 'lucide-react';
import { api } from '../../../api';
import type { Consultation } from '../../../types/consultation-models';
import { LoadingSpinner } from '../../../Components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

type Tab = 'pending' | 'assigned';

function AgentConsultations() {
  const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [pendingConsultations, setPendingConsultations] = useState<Consultation[]>([]);
  const [assignedConsultations, setAssignedConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  const currentConsultations = activeTab === 'pending' ? pendingConsultations : assignedConsultations;

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    const filtered = currentConsultations.filter(c =>
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customer?.user?.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customer?.user?.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customer?.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConsultations(filtered);
    setCurrentPage(1);
  }, [searchQuery, currentConsultations, activeTab]);

  const loadConsultations = async (silent = false) => {
    if (!silent) setLoading(true);

    const [pendingRes, assignedRes] = await Promise.all([
      api.agentConsultations.getPending(),
      api.agentConsultations.getAssignedToMe(),
    ]);

    if (!silent) setLoading(false);

    if (pendingRes.isSuccess && pendingRes.data) {
      setPendingConsultations(pendingRes.data);
    }
    if (assignedRes.isSuccess && assignedRes.data) {
      setAssignedConsultations(assignedRes.data);
    }
    if (pendingRes.isError) {
      setError(pendingRes.message || '');
    }
  };

  const handleAssignToMe = async (id: string) => {
    setActionBusy(id);
    const response = await api.agentConsultations.assignToMe(id);
    setActionBusy(null);
    setOpenDropdown(null);

    if (response.isSuccess) {
      toast.success(response.message || t('agentConsultations.messages.assignSuccess'));
      await loadConsultations(true);
    } else {
      toast.error(response.message || t('agentConsultations.messages.assignError'));
    }
  };

  const handleComplete = async (id: string) => {
    setActionBusy(id);
    const response = await api.agentConsultations.complete(id);
    setActionBusy(null);
    setOpenDropdown(null);

    if (response.isSuccess) {
      toast.success(response.message || t('agentConsultations.messages.completeSuccess'));
      await loadConsultations(true);
    } else {
      toast.error(response.message || t('agentConsultations.messages.completeError'));
    }
  };

  const toggleDropdown = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
      setOpenDropdown(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    const key = status.toLowerCase() as 'pending' | 'confirmed' | 'completed' | 'cancelled';
    return t(`consultations.status.${key}`);
  };

  const formatDate = (dateStr: string) => {
    const locale = i18n.language === 'fr' ? fr : enUS;
    return format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale });
  };

  const getCustomerName = (c: Consultation) => {
    if (c.customer?.user) {
      return `${c.customer.user.firstName || ''} ${c.customer.user.lastName || ''}`.trim() || c.customer.user.email;
    }
    return t('agentConsultations.noCustomer');
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredConsultations.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedConsultations = filteredConsultations.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('agentConsultations.title')}
        </h1>
        <div className="hidden md:flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('agentConsultations.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={t('agentConsultations.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-4">
        <button
          onClick={() => { setActiveTab('pending'); setSearchQuery(''); }}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {t('agentConsultations.tabs.pending')} ({pendingConsultations.length})
        </button>
        <button
          onClick={() => { setActiveTab('assigned'); setSearchQuery(''); }}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'assigned'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {t('agentConsultations.tabs.assigned')} ({assignedConsultations.length})
        </button>
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
            <p className="text-lg font-medium">{t('agentConsultations.noConsultations')}</p>
            {searchQuery && (
              <p className="text-sm mt-2">{t('agentConsultations.modifySearch')}</p>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('agentConsultations.columns.subject')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('agentConsultations.columns.customer')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('agentConsultations.columns.consultationDate')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('agentConsultations.columns.duration')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('agentConsultations.columns.status')}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('agentConsultations.columns.actions')}
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
                        paginatedConsultations.map((consultation) => (
                          <tr key={consultation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {consultation.subject}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {getCustomerName(consultation)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(consultation.consultationDate)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {consultation.duration} {t('agentConsultations.minutes')}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                                {getStatusLabel(consultation.status)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end items-center">
                                <button
                                  onClick={(e) => toggleDropdown(consultation.id, e)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                                  disabled={actionBusy === consultation.id}
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
                paginatedConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                          {consultation.subject}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {getCustomerName(consultation)}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === consultation.id ? null : consultation.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openDropdown === consultation.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            {activeTab === 'pending' && (
                              <button
                                onClick={() => handleAssignToMe(consultation.id)}
                                disabled={actionBusy === consultation.id}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg disabled:opacity-50"
                              >
                                <UserPlus className="w-4 h-4" />
                                {t('agentConsultations.actions.assignToMe')}
                              </button>
                            )}
                            {activeTab === 'assigned' && consultation.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleComplete(consultation.id)}
                                disabled={actionBusy === consultation.id}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors rounded-lg disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {t('agentConsultations.actions.complete')}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">{t('agentConsultations.columns.consultationDate')}</span>
                        <span className="text-gray-900 dark:text-gray-100">{formatDate(consultation.consultationDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">{t('agentConsultations.columns.duration')}</span>
                        <span className="text-gray-900 dark:text-gray-100">{consultation.duration} {t('agentConsultations.minutes')}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                        {getStatusLabel(consultation.status)}
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
              {t('agentConsultations.pagination.showing')} <span className="font-semibold">{pageSize}</span> {t('agentConsultations.pagination.perPage')}
              <span className="hidden md:inline ml-2 text-gray-500 dark:text-gray-400">
                ({filteredConsultations.length} {t(filteredConsultations.length > 1 ? 'agentConsultations.pagination.results_plural' : 'agentConsultations.pagination.results')})
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
                title={t('agentConsultations.pagination.previous')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t('agentConsultations.pagination.next')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown global - positioned fixed to escape overflow */}
      {openDropdown && (
        <>
          <div
            className="fixed inset-0 z-30 hidden md:block"
            onClick={() => setOpenDropdown(null)}
          />
          <div
            className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-40 w-48 hidden md:block"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`,
            }}
          >
            {activeTab === 'pending' && (
              <button
                onClick={() => handleAssignToMe(openDropdown)}
                disabled={actionBusy === openDropdown}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                {t('agentConsultations.actions.assignToMe')}
              </button>
            )}
            {activeTab === 'assigned' && (() => {
              const c = assignedConsultations.find(c => c.id === openDropdown);
              return c?.status === 'CONFIRMED';
            })() && (
              <button
                onClick={() => handleComplete(openDropdown)}
                disabled={actionBusy === openDropdown}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors rounded-lg disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {t('agentConsultations.actions.complete')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AgentConsultations;
