import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { flightTicketsApi } from '../../../api/flightTicketsApi';
import { useFlightTicketContext } from './FlightTicketContext';
import { useOutletContext } from 'react-router-dom';

type OutletContext = {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
};

export default function CreateFlightTicket() {
  const { t } = useTranslation();
  const { reloadFlightTickets } = useFlightTicketContext();
  const { createModalOpen, setCreateModalOpen } = useOutletContext<OutletContext>();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>('');

  const [form, setForm] = useState({
    bookingId: '',
    customerId: '',
    departureDateTime: '',
    arrivalDateTime: '',
    seatClass: 'ECONOMY' as 'ECONOMY' | 'BUSINESS' | 'FIRST',
    ticketPrice: '',
    status: 'RESERVED' as 'RESERVED' | 'PAID' | 'CANCELLED',
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (createModalOpen) {
      setOpen(true);
    }
  }, [createModalOpen]);

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setCreateModalOpen(false);
      setForm({
        bookingId: '',
        customerId: '',
        departureDateTime: '',
        arrivalDateTime: '',
        seatClass: 'ECONOMY',
        ticketPrice: '',
        status: 'RESERVED',
      });
      setError('');
      await reloadFlightTickets();
    }, 220);
  };

  const submit = async () => {
    try {
      setBusy(true);
      setError('');

      const response = await flightTicketsApi.createFlightTicket({
        bookingId: form.bookingId.trim(),
        customerId: form.customerId.trim(),
        departureDateTime: form.departureDateTime,
        arrivalDateTime: form.arrivalDateTime,
        seatClass: form.seatClass,
        ticketPrice: parseFloat(form.ticketPrice),
        status: form.status,
      });

      if (response.isSuccess) {
        toast.success(response.message || t('flightTickets.create.success'));
        close();
      } else {
        const message = response?.message || t('flightTickets.create.error');
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('flightTickets.create.error');
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  if (!createModalOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          if (busy) return;
          close();
        }}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg z-50 flex flex-col transform transition-all duration-200 ease-out ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('flightTickets.create.title')}
          </h2>
          <button
            onClick={() => {
              if (busy) return;
              close();
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 dark:text-gray-400"
            disabled={busy}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* Booking ID */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('flightTickets.fields.bookingId')} <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={form.bookingId}
                onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
                placeholder={t('flightTickets.fields.bookingIdPlaceholder')}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Customer ID */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('flightTickets.fields.customerId')} <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                placeholder={t('flightTickets.fields.customerIdPlaceholder')}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Departure and Arrival DateTime */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('flightTickets.fields.departure')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="datetime-local"
                  value={form.departureDateTime}
                  onChange={(e) => setForm({ ...form, departureDateTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('flightTickets.fields.arrival')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="datetime-local"
                  value={form.arrivalDateTime}
                  onChange={(e) => setForm({ ...form, arrivalDateTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Seat Class */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('flightTickets.fields.seatClass')} <span className="text-red-500">*</span>
              </span>
              <select
                value={form.seatClass}
                onChange={(e) => setForm({ ...form, seatClass: e.target.value as 'ECONOMY' | 'BUSINESS' | 'FIRST' })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ECONOMY">{t('flightTickets.seatClass.economy')}</option>
                <option value="BUSINESS">{t('flightTickets.seatClass.business')}</option>
                <option value="FIRST">{t('flightTickets.seatClass.first')}</option>
              </select>
            </label>

            {/* Ticket Price */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('flightTickets.fields.price')} <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                value={form.ticketPrice}
                onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
                placeholder={t('flightTickets.fields.pricePlaceholder')}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Status */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('flightTickets.fields.status')} <span className="text-red-500">*</span>
              </span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'RESERVED' | 'PAID' | 'CANCELLED' })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="RESERVED">{t('flightTickets.status.reserved')}</option>
                <option value="PAID">{t('flightTickets.status.paid')}</option>
                <option value="CANCELLED">{t('flightTickets.status.cancelled')}</option>
              </select>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              if (busy) return;
              close();
            }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={busy}
          >
            {t('flightTickets.create.cancel')}
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? t('flightTickets.create.saving') : t('flightTickets.create.save')}
          </button>
        </div>
      </div>
    </>
  );
}
