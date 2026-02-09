import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { api } from '../../../api';
import type { Booking } from '../../../types/booking-models';
import { useBookingContext } from './BookingContext';

export default function EditBooking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { reloadBookings } = useBookingContext();

  const bookingId = id ?? '';

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [booking, setBooking] = useState<Booking | null>(null);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    numberOfAdults: 1,
    numberOfChildren: 0,
    totalPrice: 0,
    travelDate: '',
    status: 'PENDING' as string,
  });

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setMounted(false);
      await reloadBookings();
      navigate('/agent/bookings');
    }, 220);
  };

  const submit = async () => {
    if (!bookingId) return;
    try {
      setBusy(true);
      setError('');

      const response = await api.agentBookings.update(bookingId, {
        numberOfAdults: form.numberOfAdults,
        numberOfChildren: form.numberOfChildren,
        totalPrice: form.totalPrice,
        travelDate: form.travelDate,
        status: form.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
      });

      if (response.isSuccess) {
        toast.success(response.message || t('agentBookings.edit.success'));
        close();
      } else {
        const message = response?.message || t('agentBookings.edit.error');
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('agentBookings.edit.error');
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!bookingId) return;

    setMounted(true);
    const openTimer = setTimeout(() => setOpen(true), 10);

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.agentBookings.getById(bookingId);
        if (cancelled) return;

        if (!response.isSuccess || !response.data) {
          setError(response.message || t('agentBookings.edit.loadError'));
          setBooking(null);
          return;
        }

        const data = response.data;
        setBooking(data);
        setForm({
          numberOfAdults: data.numberOfAdults,
          numberOfChildren: data.numberOfChildren,
          totalPrice: parseFloat(data.totalPrice),
          travelDate: data.travelDate.split('T')[0],
          status: data.status,
        });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : t('agentBookings.edit.loadError');
        setError(message);
        setBooking(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      clearTimeout(openTimer);
      cancelled = true;
    };
  }, [bookingId, t]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[500px] max-w-[100vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col transform transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('agentBookings.edit.title')}
          </h2>
          <button
            onClick={() => { if (busy) return; close(); }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 dark:text-gray-400"
            disabled={busy}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('common.loading')}
            </div>
          ) : (
            <>
              {booking && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {booking.package?.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {booking.package?.destination?.name} - {booking.package?.destination?.country}
                  </div>
                  {booking.customer?.user && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('agentBookings.fields.customer')}: {booking.customer.user.firstName} {booking.customer.user.lastName}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {/* Adults & Children */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('agentBookings.fields.numberOfAdults')}
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={form.numberOfAdults}
                      onChange={(e) => setForm({ ...form, numberOfAdults: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('agentBookings.fields.numberOfChildren')}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.numberOfChildren}
                      onChange={(e) => setForm({ ...form, numberOfChildren: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                {/* Total Price */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('agentBookings.fields.totalPrice')}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.totalPrice}
                    onChange={(e) => setForm({ ...form, totalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Travel Date */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('agentBookings.fields.travelDate')}
                  </span>
                  <input
                    type="date"
                    value={form.travelDate}
                    onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Status */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('agentBookings.fields.status')}
                  </span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">{t('agentBookings.status.PENDING')}</option>
                    <option value="CONFIRMED">{t('agentBookings.status.CONFIRMED')}</option>
                    <option value="COMPLETED">{t('agentBookings.status.COMPLETED')}</option>
                    <option value="CANCELLED">{t('agentBookings.status.CANCELLED')}</option>
                  </select>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-start gap-3">
          <button
            onClick={submit}
            disabled={busy || loading}
            className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? t('agentBookings.edit.saving') : t('agentBookings.edit.save')}
          </button>

          <button
            onClick={() => { if (busy) return; close(); }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={busy}
          >
            {t('agentBookings.edit.cancel')}
          </button>
        </div>
      </div>
    </>
  );
}
