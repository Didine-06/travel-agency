import { useState, useEffect } from "react";
import { X, Plane } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../api";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "sonner";

interface Booking {
  id: string;
  package: {
    id: string;
    title: string;
    destination?: {
      city: string;
    };
  };
  startDate: string;
  endDate: string;
}

interface CreateFlightRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SEAT_CLASSES = ["ECONOMY", "BUSINESS", "FIRST"] as const;

export default function CreateFlightRequestModal({
  open,
  onClose,
  onSuccess,
}: CreateFlightRequestModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [formData, setFormData] = useState({
    bookingId: "",
    departureDateTime: "",
    arrivalDateTime: "",
    seatClass: "ECONOMY" as (typeof SEAT_CLASSES)[number],
    ticketPrice: "",
  });

  useEffect(() => {
    if (open) {
      loadBookings();
    }
  }, [open]);

  const loadBookings = async () => {
    setBookingsLoading(true);
    // Assuming there's a bookings API endpoint - adjust if needed
    const response = await api.bookings?.getMyBookings?.();
    setBookingsLoading(false);

    if (response?.isSuccess && response.data) {
      const bookingsData = Array.isArray(response.data) ? response.data : [];
      setBookings(bookingsData);
    } else {
      setBookings([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bookingId || !formData.departureDateTime || !formData.arrivalDateTime || !formData.ticketPrice) {
      toast.error(t('flightTickets.messages.fillAllFields'));
      return;
    }

    setLoading(true);

    const response = await api.flightTickets.createMyTicket({
      bookingId: formData.bookingId,
      departureDateTime: new Date(formData.departureDateTime).toISOString(),
      arrivalDateTime: new Date(formData.arrivalDateTime).toISOString(),
      seatClass: formData.seatClass,
      ticketPrice: parseFloat(formData.ticketPrice),
    });

    setLoading(false);

    if (response.isSuccess) {
      toast.success(t('flightTickets.messages.createSuccess'));
      resetForm();
      onSuccess();
      onClose();
    } else {
      toast.error(response?.message || t('flightTickets.messages.createError'));
    }
  };

  const resetForm = () => {
    setFormData({
      bookingId: "",
      departureDateTime: "",
      arrivalDateTime: "",
      seatClass: "ECONOMY",
      ticketPrice: "",
    });
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('flightTickets.requestFlight')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Booking Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.booking')} <span className="text-red-500">*</span>
            </label>
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <select
                value={formData.bookingId}
                onChange={(e) =>
                  setFormData({ ...formData, bookingId: e.target.value })
                }
                required
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">{t('flightTickets.form.selectBooking')}</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.package?.title || 'N/A'} - {booking.package?.destination?.city || 'N/A'}
                  </option>
                ))}
              </select>
            )}
            {bookings.length === 0 && !bookingsLoading && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('flightTickets.form.noBookings')}
              </p>
            )}
          </div>

          {/* Departure Date Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.departureDateTime')} <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.departureDateTime}
              onChange={(e) =>
                setFormData({ ...formData, departureDateTime: e.target.value })
              }
              required
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Arrival Date Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.arrivalDateTime')} <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.arrivalDateTime}
              onChange={(e) =>
                setFormData({ ...formData, arrivalDateTime: e.target.value })
              }
              required
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Seat Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.seatClass')} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.seatClass}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seatClass: e.target.value as (typeof SEAT_CLASSES)[number],
                })
              }
              required
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {SEAT_CLASSES.map((seatClass) => (
                <option key={seatClass} value={seatClass}>
                  {seatClass}
                </option>
              ))}
            </select>
          </div>

          {/* Ticket Price Estimation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.ticketPriceEstimation')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.ticketPrice}
                onChange={(e) =>
                  setFormData({ ...formData, ticketPrice: e.target.value })
                }
                required
                disabled={loading}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || bookings.length === 0}
              className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <LoadingSpinner />}
              {t('flightTickets.form.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
