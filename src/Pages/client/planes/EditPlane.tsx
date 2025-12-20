import { useContext, useEffect, useState } from 'react';
import { X, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../api';
import type { FlightTicket, SeatClass } from '../../../types/flight-ticket-models';
import { toast } from 'sonner';
import { PlaneContext } from './PlaneContext';

function EditPlane() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reloadTickets } = useContext(PlaneContext);

  const [ticket, setTicket] = useState<FlightTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    departureDateTime: '',
    arrivalDateTime: '',
    seatClass: 'ECONOMY' as SeatClass,
    ticketPrice: '',
  });

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
      setError('Erreur lors du chargement du billet');
      toast.error('Impossible de charger le billet');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/client/planes');
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
        toast.success(response.message || 'Billet modifié avec succès');
        reloadTickets();
        handleClose();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la modification';
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Modifier le billet
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ticket Info */}
              {ticket && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Vol:</span> {ticket.booking?.package?.title || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Destination:</span> {ticket.booking?.package?.destination?.city || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.status === 'PAID' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      ticket.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </p>
                  {ticket.status !== 'RESERVED' && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      ⚠️ Seuls les billets avec le statut RESERVED peuvent être modifiés
                    </p>
                  )}
                </div>
              )}

              {/* Departure DateTime */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date et heure de départ
                </label>
                <input
                  type="datetime-local"
                  name="departureDateTime"
                  value={formData.departureDateTime}
                  onChange={handleChange}
                  required
                  disabled={ticket?.status !== 'RESERVED'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Arrival DateTime */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date et heure d'arrivée
                </label>
                <input
                  type="datetime-local"
                  name="arrivalDateTime"
                  value={formData.arrivalDateTime}
                  onChange={handleChange}
                  required
                  disabled={ticket?.status !== 'RESERVED'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Seat Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Classe de siège
                </label>
                <select
                  name="seatClass"
                  value={formData.seatClass}
                  onChange={handleChange}
                  required
                  disabled={ticket?.status !== 'RESERVED'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="ECONOMY">Économique</option>
                  <option value="BUSINESS">Affaires</option>
                  <option value="FIRST">Première</option>
                </select>
              </div>

              {/* Ticket Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Prix du billet
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  disabled={ticket?.status !== 'RESERVED'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="500.00"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || ticket?.status !== 'RESERVED'}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default EditPlane;
