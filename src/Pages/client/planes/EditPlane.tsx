import { useContext, useEffect, useState } from 'react';
import { X, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../../api';
import type { FlightTicket, SeatClass } from '../../../types/flight-ticket-models';
import { toast } from 'sonner';
import { PlaneContext } from './PlaneContext';

function EditPlane() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { reloadTickets } = useContext(PlaneContext);

  const [ticket, setTicket] = useState<FlightTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    departureDateTime: '',
    arrivalDateTime: '',
    seatClass: 'ECONOMY' as SeatClass,
    ticketPrice: '',
  });

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (id) {
      loadTicket(id);
    }
  }, [id]);

  const loadTicket = async (ticketId: string) => {
    try {
      setLoading(true);
      const response = await api.flightTickets.getMyTicketById(ticketId);
      if (response.isSuccess && response.data) {
        setTicket(response.data);
        setFormData({
          departureDateTime: new Date(response.data.departureDateTime).toISOString().slice(0, 16),
          arrivalDateTime: new Date(response.data.arrivalDateTime).toISOString().slice(0, 16),
          seatClass: response.data.seatClass,
          ticketPrice: response.data.ticketPrice.toString(),
        });
      }
    } catch (err) {
      setError(t('flightTickets.edit.loadError'));
      toast.error(t('flightTickets.edit.loadErrorToast'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setMounted(false);
      reloadTickets();
      navigate('/client/planes');
    }, 220);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);
      const response = await api.flightTickets.updateMyTicket(id, {
        departureDateTime: new Date(formData.departureDateTime).toISOString(),
        arrivalDateTime: new Date(formData.arrivalDateTime).toISOString(),
        seatClass: formData.seatClass,
        ticketPrice: parseFloat(formData.ticketPrice),
      });

      if (response.isSuccess) {
        toast.success(response.message || t('flightTickets.edit.updateSuccess'));
        reloadTickets();
        handleClose();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('flightTickets.edit.updateError');
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[500px] max-w-[100vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
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
              if (saving) return;
              handleClose();
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            disabled={saving}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('common.loading')}
            </div>
          ) : (
            <>
              {/* Ticket Info */}
              {ticket && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {ticket.booking?.package?.title || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {ticket.booking?.package?.destination?.city || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('flightTickets.edit.status')} {ticket.status}
                  </div>
                  {ticket.status !== 'RESERVED' && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                      {t('flightTickets.edit.restrictionWarning')}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {/* Departure DateTime */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('flightTickets.edit.fields.departureDateTime')}
                  </span>
                  <input
                    type="datetime-local"
                    name="departureDateTime"
                    value={formData.departureDateTime}
                    onChange={handleChange}
                    disabled={ticket?.status !== 'RESERVED'}
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </label>

                {/* Arrival DateTime */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('flightTickets.edit.fields.arrivalDateTime')}
                  </span>
                  <input
                    type="datetime-local"
                    name="arrivalDateTime"
                    value={formData.arrivalDateTime}
                    onChange={handleChange}
                    disabled={ticket?.status !== 'RESERVED'}
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </label>

                {/* Seat Class */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('flightTickets.edit.fields.seatClass')}
                  </span>
                  <select
                    name="seatClass"
                    value={formData.seatClass}
                    onChange={handleChange}
                    disabled={ticket?.status !== 'RESERVED'}
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="ECONOMY">{t('flightTickets.seatClass.economy')}</option>
                    <option value="BUSINESS">{t('flightTickets.seatClass.business')}</option>
                    <option value="FIRST">{t('flightTickets.seatClass.first')}</option>
                  </select>
                </label>

                {/* Ticket Price */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('flightTickets.edit.fields.ticketPrice')}
                  </span>
                  <input
                    type="number"
                    name="ticketPrice"
                    min="0"
                    step="0.01"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    disabled={ticket?.status !== 'RESERVED'}
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-start gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving || loading || ticket?.status !== 'RESERVED'}
            className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? t('flightTickets.edit.saving') : t('flightTickets.edit.save')}
          </button>

          <button
            onClick={() => {
              if (saving) return;
              handleClose();
            }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={saving}
          >
            {t('flightTickets.edit.cancel')}
          </button>
        </div>
      </div>
    </>
  );
}

export default EditPlane;
