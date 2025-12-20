import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { api } from "../../../api";
import type { Booking } from "../../../types/booking-models";
import { useReservationContext } from "./ReservationContext";
import { X } from "lucide-react";

export default function EditBooking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { reloadBookings } = useReservationContext();

  const bookingId = id ?? "";

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [booking, setBooking] = useState<Booking | null>(null);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    numberOfAdults: 1,
    numberOfChildren: 0,
    totalPrice: 0,
    travelDate: "",
  });

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setMounted(false);
      await reloadBookings();
      navigate("/client/reservations");
    }, 220);
  };

  const submit = async () => {
    if (!bookingId) return;
    try {
      setBusy(true);
      setError("");

      const travelDateIso = form.travelDate
        ? new Date(`${form.travelDate}T00:00:00.000Z`).toISOString()
        : new Date().toISOString();

      const response = await api.bookings.updateMyBooking(bookingId, {
        numberOfAdults: Number(form.numberOfAdults),
        numberOfChildren: Number(form.numberOfChildren),
        totalPrice: Number(form.totalPrice),
        travelDate: travelDateIso,
      });

      toast.success(response.message || "Mise à jour effectuée");
      close();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la mise à jour";
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
        setError("");
        const response = await api.bookings.getMyBookingById(bookingId);
        if (cancelled) return;

        if (!response.isSuccess || !response.data) {
          setError(
            response.message || "Erreur lors du chargement de la réservation"
          );
          setBooking(null);
          return;
        }

        const bookingData = response.data;
        setBooking(bookingData);
        setForm({
          numberOfAdults: bookingData.numberOfAdults ?? 1,
          numberOfChildren: bookingData.numberOfChildren ?? 0,
          totalPrice: Number(bookingData.totalPrice ?? 0),
          travelDate: bookingData.travelDate
            ? new Date(bookingData.travelDate).toISOString().slice(0, 10)
            : "",
        });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement de la réservation";
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
  }, [bookingId]);

  if (!mounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[500px] max-w-[100vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Modifier réservation
            </h2>
          </div>
          <X
            onClick={() => {
              if (busy) return;
              close();
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Chargement...
            </div>
          ) : (
            <>
              {booking && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {booking.package.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {booking.package.destination.city},{" "}
                    {booking.package.destination.country}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Statut: {booking.status}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date de voyage
                  </span>
                  <input
                    type="date"
                    value={form.travelDate}
                    onChange={(e) =>
                      setForm({ ...form, travelDate: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adultes
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={form.numberOfAdults}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          numberOfAdults: Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enfants
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={form.numberOfChildren}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          numberOfChildren: Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prix total
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.totalPrice}
                    onChange={(e) =>
                      setForm({ ...form, totalPrice: Number(e.target.value) })
                    }
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-start gap-3">
          <button
            onClick={submit}
            disabled={busy || loading}
            className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? "Enregistrement..." : "Enregistrer"}
          </button>

          <button
            onClick={() => {
              if (busy) return;
              close();
            }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={busy}
          >
            Annuler
          </button>
        </div>
      </div>
    </>
  );
}
