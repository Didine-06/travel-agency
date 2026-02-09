import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { api } from '../../../api';
import { usePackageContext } from './PackageContext';
import { useOutletContext } from 'react-router-dom';
import type { Destination } from '../../../types/Destination-models';

type OutletContext = {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
};

export default function CreatePackage() {
  const { t } = useTranslation();
  const { reloadPackages } = usePackageContext();
  const { createModalOpen, setCreateModalOpen } = useOutletContext<OutletContext>();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>('');
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const [form, setForm] = useState({
    destinationId: '',
    title: '',
    description: '',
    duration: 1,
    price: 0,
    includedServices: '',
    imagesUrls: '',
    availableFrom: '',
    availableTo: '',
    maxCapacity: 1,
    isActive: true,
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (createModalOpen) {
      setOpen(true);
      loadDestinations();
    }
  }, [createModalOpen]);

  const loadDestinations = async () => {
    const res = await api.destinations.getAllDestinations();
    if (res.isSuccess && res.data) setDestinations(res.data.filter(d => d.isActive));
  };

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setCreateModalOpen(false);
      setForm({
        destinationId: '',
        title: '',
        description: '',
        duration: 1,
        price: 0,
        includedServices: '',
        imagesUrls: '',
        availableFrom: '',
        availableTo: '',
        maxCapacity: 1,
        isActive: true,
      });
      setError('');
      await reloadPackages();
    }, 220);
  };

  const submit = async () => {
    try {
      setBusy(true);
      setError('');

      const response = await api.agentPackages.create({
        destinationId: form.destinationId,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        duration: form.duration,
        price: form.price,
        includedServices: form.includedServices ? form.includedServices.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        imagesUrls: form.imagesUrls ? form.imagesUrls.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        availableFrom: form.availableFrom,
        availableTo: form.availableTo,
        maxCapacity: form.maxCapacity,
        isActive: form.isActive,
      });

      if (response.isSuccess) {
        toast.success(response.message || t('agentPackages.create.success'));
        close();
      } else {
        const message = response?.message || t('agentPackages.create.error');
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('agentPackages.create.error');
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
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg z-50 flex flex-col transform transition-all duration-200 ease-out ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('agentPackages.create.title')}
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
            {/* Destination */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('agentPackages.fields.destination')} <span className="text-red-500">*</span>
              </span>
              <select
                value={form.destinationId}
                onChange={(e) => setForm({ ...form, destinationId: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('agentPackages.fields.selectDestination')}</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.city}, {d.country})
                  </option>
                ))}
              </select>
            </label>

            {/* Title */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('agentPackages.fields.title')} <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Description */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('agentPackages.fields.description')}
              </span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </label>

            {/* Duration & Price */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('agentPackages.fields.duration')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 1 })}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('agentPackages.fields.price')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Included Services */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('agentPackages.fields.includedServices')}
              </span>
              <input
                type="text"
                value={form.includedServices}
                onChange={(e) => setForm({ ...form, includedServices: e.target.value })}
                placeholder={t('agentPackages.fields.includedServicesPlaceholder')}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Images URLs */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('agentPackages.fields.imagesUrls')}
              </span>
              <input
                type="text"
                value={form.imagesUrls}
                onChange={(e) => setForm({ ...form, imagesUrls: e.target.value })}
                placeholder={t('agentPackages.fields.imagesUrlsPlaceholder')}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Available From/To */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('agentPackages.fields.availableFrom')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  value={form.availableFrom}
                  onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('agentPackages.fields.availableTo')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  value={form.availableTo}
                  onChange={(e) => setForm({ ...form, availableTo: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Max Capacity & Active */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('agentPackages.fields.maxCapacity')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.maxCapacity}
                  onChange={(e) => setForm({ ...form, maxCapacity: parseInt(e.target.value) || 1 })}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('agentPackages.fields.isActive')}
                </span>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    {form.isActive ? t('agentPackages.status.active') : t('agentPackages.status.inactive')}
                  </span>
                </div>
              </label>
            </div>
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
            {t('agentPackages.create.cancel')}
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? t('agentPackages.create.saving') : t('agentPackages.create.save')}
          </button>
        </div>
      </div>
    </>
  );
}
