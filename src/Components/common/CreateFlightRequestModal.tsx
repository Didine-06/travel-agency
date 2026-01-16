import { useState } from "react";
import { X, Plane, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../api";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "sonner";

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
  const [attachment, setAttachment] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    departureDateTime: "",
    returnDate: "",
    isRoundTrip: false,
    airline: "",
    seatClass: "ECONOMY" as (typeof SEAT_CLASSES)[number],
    ticketPrice: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.departureDateTime || !formData.airline || !formData.ticketPrice) {
      toast.error(t('flightTickets.messages.fillAllFields'));
      return;
    }

    if (formData.isRoundTrip && !formData.returnDate) {
      toast.error(t('flightTickets.messages.returnDateRequired'));
      return;
    }

    if (formData.isRoundTrip && formData.returnDate && new Date(formData.returnDate) <= new Date(formData.departureDateTime)) {
      toast.error(t('flightTickets.messages.returnDateMustBeAfterDeparture'));
      return;
    }

    setLoading(true);

    const payload: any = {
      departureDateTime: new Date(formData.departureDateTime).toISOString(),
      arrivalDateTime: formData.isRoundTrip && formData.returnDate 
        ? new Date(formData.returnDate).toISOString()
        : new Date(new Date(formData.departureDateTime).getTime() + 2 * 60 * 60 * 1000).toISOString(), // +2 hours default
      airline: formData.airline,
      seatClass: formData.seatClass,
      ticketPrice: parseFloat(formData.ticketPrice),
    };

    if (attachment) {
      payload.attachment = attachment;
    }

    const response = await api.flightTickets.createMyTicket(payload);

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
      departureDateTime: "",
      returnDate: "",
      isRoundTrip: false,
      airline: "",
      seatClass: "ECONOMY",
      ticketPrice: "",
    });
    setAttachment(null);
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('flightTickets.messages.fileTooLarge'));
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(t('flightTickets.messages.invalidFileType'));
        return;
      }
      setAttachment(file);
    }
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
          {/* Airline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.airline')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.airline}
              onChange={(e) =>
                setFormData({ ...formData, airline: e.target.value })
              }
              required
              disabled={loading}
              placeholder={t('flightTickets.form.airlinePlaceholder')}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
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

          {/* Trip Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.tripType')} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={!formData.isRoundTrip}
                  onChange={() => setFormData({ ...formData, isRoundTrip: false, returnDate: "" })}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('flightTickets.form.oneWay')}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={formData.isRoundTrip}
                  onChange={() => setFormData({ ...formData, isRoundTrip: true })}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('flightTickets.form.roundTrip')}
                </span>
              </label>
            </div>
          </div>

          {/* Return Date Time - Only show if round trip */}
          {formData.isRoundTrip && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('flightTickets.form.returnDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.returnDate}
                min={formData.departureDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, returnDate: e.target.value })
                }
                required={formData.isRoundTrip}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          )}

          {/* Airline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.airline')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.airline}
              onChange={(e) =>
                setFormData({ ...formData, airline: e.target.value })
              }
              required
              disabled={loading}
              placeholder={t('flightTickets.form.airlinePlaceholder')}
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

          {/* Attachment Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('flightTickets.form.attachment')} ({t('flightTickets.form.attachmentOptional')})
            </label>
            <div className="relative">
              <input
                type="file"
                id="attachment-upload"
                onChange={handleFileChange}
                disabled={loading}
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                className="hidden"
              />
              <label
                htmlFor="attachment-upload"
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {attachment ? attachment.name : t('flightTickets.form.attachmentPlaceholder')}
                </span>
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('flightTickets.form.attachmentHint')}
            </p>
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
              disabled={loading}
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
