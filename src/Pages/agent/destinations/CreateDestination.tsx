import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { api } from '../../../api';
import { useDestinationContext } from './DestinationContext';
import { useOutletContext } from 'react-router-dom';

type OutletContext = {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
};

export default function CreateDestination() {
  const { t } = useTranslation();
  const { reloadDestinations } = useDestinationContext();
  const { createModalOpen, setCreateModalOpen } = useOutletContext<OutletContext>();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    country: '',
    city: '',
    description: '',
    imageUrl: '',
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
        name: '',
        country: '',
        city: '',
        description: '',
        imageUrl: '',
      });
      setError('');
      await reloadDestinations();
    }, 220);
  };

  const submit = async () => {
    try {
      setBusy(true);
      setError('');

      const response = await api.destinations.createDestination({
        name: form.name.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      });

      if (response.isSuccess) {
        toast.success(response.message || t('destinations.create.success'));
        close();
      } else {
        const message = response?.message || t('destinations.create.error');
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('destinations.create.error');
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
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg z-50 flex flex-col transform transition-all duration-200 ease-out ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('destinations.create.title')}
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
            {/* Name */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('destinations.fields.name')} <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('destinations.fields.namePlaceholder')}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Country and City */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('destinations.fields.country')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder={t('destinations.fields.countryPlaceholder')}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('destinations.fields.city')} <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder={t('destinations.fields.cityPlaceholder')}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Description */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('destinations.fields.description')} <span className="text-red-500">*</span>
              </span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t('destinations.fields.descriptionPlaceholder')}
                required
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </label>

            {/* Image URL */}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('destinations.fields.imageUrl')} <span className="text-red-500">*</span>
              </span>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder={t('destinations.fields.imageUrlPlaceholder')}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Image Preview */}
            {form.imageUrl && (
              <div className="mt-2">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
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
            {t('destinations.create.cancel')}
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? t('destinations.create.saving') : t('destinations.create.save')}
          </button>
        </div>
      </div>
    </>
  );
}
