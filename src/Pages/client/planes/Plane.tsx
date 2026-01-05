import { useEffect, useMemo, useState, useRef } from "react";
import {
  Search,
  MoreVertical,
  Calendar,
  Trash2,
  Edit,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Plane,
  Ban,
} from "lucide-react";
import { api } from "../../../api";
import type { FlightTicket } from "../../../types/flight-ticket-models";
import ConfirmDeleteModal from "../../../Components/common/ConfirmDeleteModal";
import ConfirmCancelModal from "../../../Components/common/ConfirmCancelModal";
import CreateFlightRequestModal from "../../../Components/common/CreateFlightRequestModal";
import { LoadingSpinner } from "../../../Components/common/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Outlet, useNavigate } from "react-router-dom";
import { PlaneContext } from "./PlaneContext";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

function ClientPlane() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<FlightTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<FlightTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] =
    useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(
    new Set()
  );

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);

  const [createFlightModalOpen, setCreateFlightModalOpen] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    // Filter tickets based on search query
    const filtered = tickets.filter((ticket) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        ticket.seatClass.toLowerCase().includes(searchLower) ||
        ticket.status.toLowerCase().includes(searchLower) ||
        ticket.booking?.package?.title.toLowerCase().includes(searchLower) ||
        ticket.customer?.firstName.toLowerCase().includes(searchLower) ||
        ticket.customer?.lastName.toLowerCase().includes(searchLower) ||
        ticket.customer?.email.toLowerCase().includes(searchLower)
      );
    });
    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [searchQuery, tickets]);

  const selectedCount = selectedTickets.size;

  const selectedIdsInFiltered = useMemo(() => {
    if (selectedTickets.size === 0) return [];
    const filteredIds = new Set(filteredTickets.map((t) => String(t.id)));
    return Array.from(selectedTickets).filter((id) => filteredIds.has(id));
  }, [filteredTickets, selectedTickets]);

  const loadTickets = async (silent = false) => {
    if (!silent) setLoading(true);

    const response = await api.flightTickets.getMyTickets();

    if (!silent) setLoading(false);

    if (response.isSuccess && response.data) {
      const ticketsData = response.data || response.data;
      const ticketsArray = Array.isArray(ticketsData) ? ticketsData : [];
      setTickets(ticketsArray);
      setFilteredTickets(ticketsArray);
    } else {
      setTickets([]);
      setFilteredTickets([]);
      if (response?.message) {
        setError(response.message);
        toast.error(response.message);
      }
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

  const cancelTicket = async (reason: string) => {
    if (!cancelTargetId) return;

    setCancelBusy(true);

    const response = await api.flightTickets.cancelMyTicket(cancelTargetId, {
      cancelReason: reason,
    });

    setCancelBusy(false);

    if (response.isSuccess) {
      const message = response?.message || t('flightTickets.messages.cancelSuccess');
      toast.success(message);
      setCancelTargetId(null);
      setConfirmCancelOpen(false);
      await loadTickets();
    } else {
      const errorMessage = response?.message || t('flightTickets.messages.cancelError');
      toast.error(errorMessage);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/client/planes/${id}`);
    setOpenDropdown(null);
  };

  const toggleDropdown = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
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

  const handleSelectTicket = (id: string) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTickets(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTickets.size === currentTickets.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(currentTickets.map((t) => String(t.id))));
    }
  };

  const requestBulkDelete = () => {
    if (selectedIdsInFiltered.length === 0) return;
    setDeleteTargetIds(selectedIdsInFiltered);
    setConfirmDeleteOpen(true);
    setOpenDropdown(null);
  };

  const deleteOne = async (id: string) => {
    setDeleteBusy(true);

    const response = await api.flightTickets.deleteMyTicket(id);

    setDeleteBusy(false);

    if (response.isSuccess) {
      const message = response?.message || t('flightTickets.messages.deleteSuccess');
      toast.success(message);
      setSelectedTickets(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);
      await loadTickets();
    } else {
      const errorMessage = response?.message || t('flightTickets.messages.deleteError');
      toast.error(errorMessage);
    }
  };

  const deleteMany = async (ids: string[]) => {
    setDeleteBusy(true);

    const response = await api.flightTickets.deleteMyTickets(ids);

    setDeleteBusy(false);

    if (response.isSuccess) {
      const message = response?.message || t('flightTickets.messages.deleteManySuccess');
      toast.success(message);
      setSelectedTickets(new Set());
      setConfirmDeleteOpen(false);
      setDeleteTargetIds([]);
      await loadTickets();
    } else {
      const errorMessage = response?.message || t('flightTickets.messages.deleteManyError');
      toast.error(errorMessage);
    }
  };

  const onConfirmDelete = async () => {
    if (deleteTargetIds.length === 0) return;
    if (deleteTargetIds.length === 1) return deleteOne(deleteTargetIds[0]);
    return deleteMany(deleteTargetIds);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "RESERVED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getSeatClassColor = (seatClass: string) => {
    switch (seatClass) {
      case "FIRST":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "BUSINESS":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "ECONOMY":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('flightTickets.title')}
        </h1>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setCreateFlightModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plane className="w-4 h-4" />
            {t('flightTickets.requestFlight')}
          </button>
          {selectedCount > 0 && (
            <button
              onClick={requestBulkDelete}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title={t('flightTickets.delete')}
            >
              <Trash2 className="w-4 h-4" />
              {t('flightTickets.deleteSelected', { count: selectedCount })}
            </button>
          )}

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('flightTickets.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-20 space-y-3">
        <button
          onClick={() => setCreateFlightModalOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plane className="w-4 h-4" />
          {t('flightTickets.requestFlight')}
        </button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={t('flightTickets.search')}
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

        {filteredTickets.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Plane className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('flightTickets.noTickets')}</p>
            {searchQuery && (
              <p className="text-sm mt-2">
                {t('flightTickets.modifySearch')}
              </p>
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
                            checked={
                              selectedTickets.size === currentTickets.length &&
                              currentTickets.length > 0
                            }
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('flightTickets.columns.flight')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('flightTickets.columns.departure')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('flightTickets.columns.arrival')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('flightTickets.columns.class')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('flightTickets.columns.price')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('flightTickets.columns.status')}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                          {t('flightTickets.columns.actions')}
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
                        currentTickets.map((ticket) => (
                          <tr
                            key={ticket.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={selectedTickets.has(String(ticket.id))}
                                onChange={() =>
                                  handleSelectTicket(String(ticket.id))
                                }
                                className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {ticket.booking?.package?.title || "N/A"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {ticket.booking?.package?.destination?.city ||
                                  "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {new Date(
                                ticket.departureDateTime
                              ).toLocaleString("fr-FR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {new Date(ticket.arrivalDateTime).toLocaleString(
                                "fr-FR",
                                {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeatClassColor(
                                  ticket.seatClass
                                )}`}
                              >
                                {ticket.seatClass}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                              ${ticket.ticketPrice}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  ticket.status
                                )}`}
                              >
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end items-center">
                                <button
                                  onClick={(e) =>
                                    toggleDropdown(String(ticket.id), e)
                                  }
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
                currentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                          {ticket.booking?.package?.title || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {ticket.booking?.package?.destination?.city || "N/A"}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === String(ticket.id)
                                ? null
                                : String(ticket.id)
                            )
                          }
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openDropdown === String(ticket.id) && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <button
                              onClick={() => handleEdit(String(ticket.id))}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                            >
                              <Edit className="w-4 h-4" />
                              {t('flightTickets.actions.edit')}
                            </button>
                            {ticket.status !== 'PAID' && (
                              <button
                                onClick={() =>
                                  requestCancelOne(String(ticket.id))
                                }
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                              >
                                <Ban className="w-4 h-4" />
                                {t('flightTickets.actions.cancel')}
                              </button>
                            )}
                            <button
                              onClick={() =>
                                requestDeleteOne(String(ticket.id))
                              }
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('flightTickets.actions.delete')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Plane className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {t('flightTickets.columns.class')}:{" "}
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getSeatClassColor(
                              ticket.seatClass
                            )}`}
                          >
                            {ticket.seatClass}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {t('flightTickets.columns.departure')}:{" "}
                          {new Date(ticket.departureDateTime).toLocaleString(
                            "fr-FR",
                            {
                              dateStyle: "short",
                              timeStyle: "short",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {t('flightTickets.columns.arrival')}:{" "}
                          {new Date(ticket.arrivalDateTime).toLocaleString(
                            "fr-FR",
                            {
                              dateStyle: "short",
                              timeStyle: "short",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ${ticket.ticketPrice}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Dropdown global - positionné en fixed pour sortir de l'overflow (Desktop uniquement) */}
      {openDropdown && (
        <>
          <div
            className="hidden md:block fixed inset-0 z-30"
            onClick={() => setOpenDropdown(null)}
          />
          <div
            className="hidden md:block fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-40 w-48"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`,
            }}
          >
            <button
              onClick={() => handleEdit(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
            >
              <Edit className="w-4 h-4" />
              {t('flightTickets.actions.edit')}
            </button>
            {(() => {
              const ticket = tickets.find(t => String(t.id) === openDropdown);
              return ticket?.status !== 'PAID' && (
                <button
                  onClick={() => requestCancelOne(openDropdown)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  {t('flightTickets.actions.cancel')}
                </button>
              );
            })()}
            <button
              onClick={() => requestDeleteOne(openDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
            >
              <Trash2 className="w-4 h-4" />
              {t('flightTickets.actions.delete')}
            </button>
          </div>
        </>
      )}

      {/* Pagination Footer - Fixed at bottom */}
      {filteredTickets.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-auto md:right-auto md:relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg md:shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center justify-between max-w-full">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('flightTickets.pagination.showing')}: <span className="font-semibold">{pageSize}</span> {t('flightTickets.pagination.perPage')}
              <span className="hidden md:inline ml-2 text-gray-500 dark:text-gray-400">
                ({filteredTickets.length} {filteredTickets.length > 1 ? t('flightTickets.pagination.results_plural') : t('flightTickets.pagination.results')})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(
                    Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]
                  );
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="p-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t('flightTickets.pagination.previous')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="p-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t('flightTickets.pagination.next')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => {
          if (deleteBusy) return;
          setConfirmDeleteOpen(false);
          setDeleteTargetIds([]);
        }}
        onConfirm={onConfirmDelete}
        entityLabel={t(
          deleteTargetIds.length > 1 ? "entities.tickets" : "entities.ticket"
        )}
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
        onConfirm={cancelTicket}
        entityLabel="le billet"
        loading={cancelBusy}
      />

      <CreateFlightRequestModal
        open={createFlightModalOpen}
        onClose={() => setCreateFlightModalOpen(false)}
        onSuccess={() => loadTickets(true)}
      />

      {/* Child route renders the drawer */}
      <PlaneContext.Provider value={{ reloadTickets: () => loadTickets(true) }}>
        <Outlet />
      </PlaneContext.Provider>
    </div>
  );
}

export default ClientPlane;
