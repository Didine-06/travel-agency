import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { api } from '../../../api';
import { useBookingContext } from './BookingContext';
import { useOutletContext } from 'react-router-dom';
import type { Customer } from '../../../types/customer-models';
import type { PackageResponse } from '../../../types/Package-models';

type OutletContext = {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
};

export default function CreateBooking() {
  const { t } = useTranslation();
  const { reloadBookings } = useBookingContext();
  const { createModalOpen, setCreateModalOpen } = useOutletContext<OutletContext>();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<PackageResponse[]>([]);

  const [form, setForm] = useState({
    customerId: '',
    packageId: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    totalPrice: 0,
    travelDate: '',
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (createModalOpen) {
      setOpen(true);
      loadSelectData();
    }
  }, [createModalOpen]);

  const loadSelectData = async () => {
    const [custRes, pkgRes] = await Promise.all([
      api.customers.getAllCustomers(),
      api.agentPackages.getAll(),
    ]);
    if (custRes.isSuccess && custRes.data) setCustomers(custRes.data);
    if (pkgRes.isSuccess && pkgRes.data) setPackages(pkgRes.data.filter(p => p.isActive));
  };

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setCreateModalOpen(false);
      setForm({
        customerId: '',
        packageId: '',
        numberOfAdults: 1,
        numberOfChildren: 0,
        totalPrice: 0,
        travelDate: '',
      });
      setError('');
      await reloadBookings();
    }, 220);
  };

  const submit = async () => {
    try {
      setBusy(true);
      setError('');

      const response = await api.agentBookings.create({
        customerId: form.customerId,
        packageId: form.packageId,
        numberOfAdults: form.numberOfAdults,
        numberOfChildren: form.numberOfChildren,
        totalPrice: form.totalPrice,
        travelDate: form.travelDate,
      });

      if (response.isSuccess) {
        toast.success(response.message || t('agentBookings.create.success'));
        close();
      } else {
        const message = response?.message || t('agentBookings.create.error');
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('agentBookings.create.error');
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
        onClick={() => { if (busy) return; close(); }}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg z-50 flex flex-col transform transition-all duration-200 ease-out ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('agentBookings.create.title')}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[70vh]">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* Customer */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('agentBookings.fields.customer')} <span className="text-red-500">*</span>
              </span>
              <select
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('agentBookings.fields.selectCustomer')}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.user.firstName} {c.user.lastName} ({c.user.email})
                  </option>
                ))}
              </select>
            </label>

            {/* Package */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('agentBookings.fields.package')} <span className="text-red-500">*</span>
              </span>
              <select
                value={form.packageId}
                onChange={(e) => setForm({ ...form, packageId: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('agentBookings.fields.selectPackage')}</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {p.destination?.name} ({p.price} DZD)
                  </option>
                ))}
              </select>
            </label>

            {/* Adults and Children */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('agentBookings.fields.numberOfAdults')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.numberOfAdults}
                  onChange={(e) => setForm({ ...form, numberOfAdults: parseInt(e.target.value) || 1 })}
                  required
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
                {t('agentBookings.fields.totalPrice')} <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.totalPrice}
                onChange={(e) => setForm({ ...form, totalPrice: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Travel Date */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('agentBookings.fields.travelDate')} <span className="text-red-500">*</span>
              </span>
              <input
                type="date"
                value={form.travelDate}
                onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => { if (busy) return; close(); }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={busy}
          >
            {t('agentBookings.create.cancel')}
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? t('agentBookings.create.saving') : t('agentBookings.create.save')}
          </button>
        </div>
      </div>
    </>
  );
}
