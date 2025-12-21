import { useEffect, useMemo, useState, useRef } from 'react';
import { Search, MoreVertical, Calendar, MapPin, Users, Trash2, Edit, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../api';
import type { Booking } from '../../types/booking-models';
import ConfirmDeleteModal from '../../Components/common/ConfirmDeleteModal';
import { LoadingSpinner } from '../../Components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Outlet, useNavigate } from 'react-router-dom';
import { ReservationContext } from './reservations/ReservationContext';


const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

function ClientReservation() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    // Filter bookings based on search query
    const filtered = bookings.filter(booking => 
      booking.package.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.package.destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.package.destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchQuery, bookings]);

  const selectedCount = selectedBookings.size;

  const selectedIdsInFiltered = useMemo(() => {
    if (selectedBookings.size === 0) return [];
    const filteredIds = new Set(filteredBookings.map(b => String(b.id)));
    return Array.from(selectedBookings).filter(id => filteredIds.has(id));
  }, [filteredBookings, selectedBookings]);

  const loadBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.bookings.getMyBookings();
      if (response.isSuccess && response.data) {
        setBookings(response.data);
        setFilteredBookings(response.data);
      }
    } catch (err) {
      setError(t('reservations.messages.loadError'));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const requestDeleteOne = (id: string) => {
    setDeleteTargetIds([id]);
    setConfirmDeleteOpen(true);
    setOpenDropdown(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/client/reservations/${id}`);
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

  const handleSelectBooking = (id: string) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBookings(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBookings.size === currentBookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(new Set(currentBookings.map(b => String(b.id))));
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
      const response = await api.bookings.deleteMyBooking(id);
      setSelectedBookings(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);

      if (response?.message) toast.success(response.message);
      else toast.success(t('reservations.messages.deleteSuccess'));

      await loadBookings();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('reservations.messages.deleteError');
      setError(message);
      toast.error(message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const deleteMany = async (ids: string[]) => {
    try {
      setDeleteBusy(true);
      const response = await api.bookings.deleteMyBookings(ids);
      setSelectedBookings(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);

      if (response?.message) toast.success(response.message);
      else toast.success(t('reservations.messages.deleteSuccess'));

      await loadBookings();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('reservations.messages.deleteError');
      setError(message);
      toast.error(message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const onConfirmDelete = async () => {
    if (deleteTargetIds.length === 0) return;
    if (deleteTargetIds.length === 1) return deleteOne(deleteTargetIds[0]);
    return deleteMany(deleteTargetIds);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('reservations.title')}
        </h1>
        <div className="hidden md:flex items-center gap-3">
          {selectedCount > 0 && (
            <button
              onClick={requestBulkDelete}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title={t('reservations.delete')}
            >
              <Trash2 className="w-4 h-4" />
              {t('reservations.deleteSelected', { count: selectedCount })}
            </button>
          )}

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('reservations.search')}
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
            placeholder={t('reservations.search')}
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

        {filteredBookings.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Calendar className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('reservations.noReservations')}</p>
            {searchQuery && (
              <p className="text-sm mt-2">{t('reservations.modifySearch')}</p>
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
                        checked={selectedBookings.size === currentBookings.length && currentBookings.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                      {t('reservations.columns.package')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                      {t('reservations.columns.destination')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                      {t('reservations.columns.travelDate')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                      {t('reservations.columns.travelers')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                      {t('reservations.columns.totalPrice')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                      {t('reservations.columns.status')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                      {t('reservations.columns.actions')}
                    </th>
                  </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <div className="flex justify-center items-center">
                          <LoadingSpinner />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedBookings.has(String(booking.id))}
                          onChange={() => handleSelectBooking(String(booking.id))}
                          className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {booking.package.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t('reservations.duration', { count: booking.package.duration })}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {booking.package.destination.city}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.package.destination.country}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {new Date(booking.travelDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {t('reservations.travelers.adult', { count: booking.numberOfAdults })}
                        </div>
                        {booking.numberOfChildren > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t('reservations.travelers.child', { count: booking.numberOfChildren })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        ${booking.totalPrice}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end items-center">
                          <button
                            onClick={(e) => toggleDropdown(String(booking.id), e)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
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
                currentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                        {booking.package.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('reservations.duration', { count: booking.package.duration })}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === String(booking.id) ? null : String(booking.id))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openDropdown === String(booking.id) && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <button
                            onClick={() => handleEdit(String(booking.id))}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                          >
                            <Edit className="w-4 h-4" />
                            {t('reservations.actions.edit')}
                          </button>
                          <button
                            onClick={() => requestDeleteOne(String(booking.id))}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('reservations.actions.delete')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {booking.package.destination.city}, {booking.package.destination.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {new Date(booking.travelDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {t('reservations.travelers.adult', { count: booking.numberOfAdults })}
                        {booking.numberOfChildren > 0 && `, ${t('reservations.travelers.child', { count: booking.numberOfChildren })}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ${booking.totalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              )))}
            </div>
          </>
        )}
      </div>

      {/* Pagination Footer - Fixed at bottom */}
      {filteredBookings.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-auto md:right-auto md:relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg md:shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center justify-between max-w-full">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('reservations.pagination.showing')} <span className="font-semibold">{pageSize}</span> {t('reservations.pagination.perPage')}
              <span className="hidden md:inline ml-2 text-gray-500 dark:text-gray-400">
                ({filteredBookings.length} {t(`reservations.pagination.${filteredBookings.length > 1 ? 'results_plural' : 'results'}`)})
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
                title={t('reservations.pagination.previous')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t('reservations.pagination.next')}
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
              onClick={() => handleEdit(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
            >
              <Edit className="w-4 h-4" />
              {t('reservations.actions.edit')}
            </button>
            <button
              onClick={() => requestDeleteOne(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
            >
              <Trash2 className="w-4 h-4" />
              {t('reservations.actions.delete')}
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
        entityLabel={t(deleteTargetIds.length > 1 ? 'entities.bookings' : 'entities.booking')}
        count={deleteTargetIds.length}
        loading={deleteBusy}
      />

      {/* Child route renders the drawer */}
      <ReservationContext.Provider value={{ reloadBookings: () => loadBookings(true) }}>
        <Outlet />
      </ReservationContext.Provider>
    </div>
  );
}

export default ClientReservation;