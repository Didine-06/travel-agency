import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

import { flightTicketsApi } from '../../../api/flightTicketsApi';
import type { FlightTicket } from '../../../types/flight-ticket-models';
import { useFlightTicketContext } from './FlightTicketContext';

export default function EditFlightTicket() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { reloadFlightTickets } = useFlightTicketContext();

  const ticketId = id ?? '';

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [ticket, setTicket] = useState<FlightTicket | null>(null);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    departureDateTime: '',
    returnDate: '',
    isRoundTrip: false,
    seatClass: 'ECONOMY' as 'ECONOMY' | 'BUSINESS' | 'FIRST',
    ticketPrice: '',
    status: 'RESERVED' as 'RESERVED' | 'PAID' | 'CANCELLED',
  });

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setMounted(false);
      await reloadFlightTickets();
      navigate('/agent/flight-tickets');
    }, 220);
  };

  const submit = async () => {
    if (!ticketId) return;
    try {
      setBusy(true);
      setError('');

      const payload: any = {
        departureDateTime: new Date(form.departureDateTime).toISOString(),
        isRoundTrip: form.isRoundTrip,
        seatClass: form.seatClass,
        ticketPrice: parseFloat(form.ticketPrice),
        status: form.status,
      };
      
      if (form.isRoundTrip && form.returnDate) {
        payload.returnDate = new Date(form.returnDate).toISOString();
      }
      
      const response = await flightTicketsApi.updateFlightTicket(ticketId, payload);

      if (response.isSuccess) {
        toast.success(response.message || t('flightTickets.edit.success'));
        close();
      } else {
        const message = response?.message || t('flightTickets.edit.error');
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('flightTickets.edit.error');
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!ticketId) return;

    setMounted(true);
    const openTimer = setTimeout(() => setOpen(true), 10);

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await flightTicketsApi.getFlightTicketById(ticketId);
        
        console.log('Loaded ticket:', response);

        if (cancelled) return;
        if (!response.isSuccess || !response.data) {
          setError(response.message || t('flightTickets.edit.loadError'));
          setTicket(null);
          return;
        }

        const ticketData = response.data;
        setTicket(ticketData);
        
        // Convert ISO datetime to datetime-local format (YYYY-MM-DDTHH:mm)
        const departureDate = new Date(ticketData.departureDateTime);
        const departureLocal = new Date(departureDate.getTime() - departureDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        
        let returnLocal = '';
        if (ticketData.returnDate) {
          const returnDate = new Date(ticketData.returnDate);
          returnLocal = new Date(returnDate.getTime() - returnDate.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        }
        
        setForm({
          departureDateTime: departureLocal,
          returnDate: returnLocal,
          isRoundTrip: ticketData.isRoundTrip,
          seatClass: ticketData.seatClass,
          ticketPrice: ticketData.ticketPrice.toString(),
          status: ticketData.status,
        });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : t('flightTickets.edit.loadError');
        setError(message);
        setTicket(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      clearTimeout(openTimer);
      cancelled = true;
    };
  }, [ticketId, t]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        className={`fixed top-0 right-0 h-full w-[600px] max-w-[100vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col transform transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('flightTickets.edit.title')}
            </h2>
          </div>
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
              {ticket && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/40 space-y-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {ticket.customer?.user?.firstName} {ticket.customer?.user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {ticket.customer?.user?.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{t('flightTickets.fields.airline')}:</span> {ticket.airline}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{t('flightTickets.fields.departure')}:</span> {formatDate(ticket.departureDateTime)}
                  </div>
                  {ticket.isRoundTrip && ticket.returnDate && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{t('flightTickets.fields.return')}:</span> {formatDate(ticket.returnDate)}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{t('flightTickets.fields.tripType')}:</span> {ticket.isRoundTrip ? t('flightTickets.form.roundTrip') : t('flightTickets.form.oneWay')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{t('flightTickets.columns.status')}:</span> {t(`flightTickets.status.${ticket.status.toLowerCase()}`)}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {/* Trip Type */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('flightTickets.fields.tripType')}
                  </span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        checked={!form.isRoundTrip}
                        onChange={() => setForm({ ...form, isRoundTrip: false, returnDate: '' })}
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
                        checked={form.isRoundTrip}
                        onChange={() => setForm({ ...form, isRoundTrip: true })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t('flightTickets.form.roundTrip')}
                      </span>
                    </label>
                  </div>
                </label>

                {/* Departure DateTime */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('flightTickets.fields.departure')}
                  </span>
                  <input
                    type="datetime-local"
                    value={form.departureDateTime}
                    onChange={(e) => setForm({ ...form, departureDateTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Return Date - Only show if round trip */}
                {form.isRoundTrip && (
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('flightTickets.fields.return')}
                    </span>
                    <input
                      type="datetime-local"
                      value={form.returnDate}
                      min={form.departureDateTime}
                      onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                )}

                {/* Seat Class */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('flightTickets.fields.seatClass')}
                  </span>
                  <select
                    value={form.seatClass}
                    onChange={(e) => setForm({ ...form, seatClass: e.target.value as 'ECONOMY' | 'BUSINESS' | 'FIRST' })}
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
                    {t('flightTickets.fields.price')}
                  </span>
                  <input
                    type="number"
                    value={form.ticketPrice}
                    onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Status */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('flightTickets.fields.status')}
                  </span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'RESERVED' | 'PAID' | 'CANCELLED' })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="RESERVED">{t('flightTickets.status.reserved')}</option>
                    <option value="PAID">{t('flightTickets.status.paid')}</option>
                    <option value="CANCELLED">{t('flightTickets.status.cancelled')}</option>
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
            {busy ? t('flightTickets.edit.saving') : t('flightTickets.edit.save')}
          </button>

          <button
            onClick={() => {
              if (busy) return;
              close();
            }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={busy}
          >
            {t('flightTickets.edit.cancel')}
          </button>
        </div>
      </div>
    </>
  );
}
