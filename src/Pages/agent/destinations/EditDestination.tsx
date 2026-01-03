import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

import { api } from '../../../api';
import type { Destination } from '../../../types/Destination-models';
import { useDestinationContext } from './DestinationContext';

export default function EditDestination() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { reloadDestinations } = useDestinationContext();

  const destinationId = id ?? '';

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [destination, setDestination] = useState<Destination | null>(null);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    country: '',
    city: '',
    description: '',
    imageUrl: '',
    isActive: false,
  });

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setMounted(false);
      await reloadDestinations();
      navigate('/agent/destinations');
    }, 220);
  };

  const submit = async () => {
    if (!destinationId) return;
    try {
      setBusy(true);
      setError('');

      const response = await api.destinations.updateDestination(destinationId, {
        name: form.name.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        isActive: form.isActive,
      });

      if (response.isSuccess) {
        toast.success(response.message || t('destinations.edit.success'));
        close();
      } else {
        const message = response?.message || t('destinations.edit.error');
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('destinations.edit.error');
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!destinationId) return;

    setMounted(true);
    const openTimer = setTimeout(() => setOpen(true), 10);

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.destinations.getDestinationById(destinationId);
        if (cancelled) return;

        if (!response.isSuccess || !response.data) {
          setError(response.message || t('destinations.edit.loadError'));
          setDestination(null);
          return;
        }

        const destinationData = response.data;
        setDestination(destinationData);
        setForm({
          name: destinationData.name,
          country: destinationData.country,
          city: destinationData.city,
          description: destinationData.description,
          imageUrl: destinationData.imageUrl,
          isActive: destinationData.isActive,
        });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : t('destinations.edit.loadError');
        setError(message);
        setDestination(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      clearTimeout(openTimer);
      cancelled = true;
    };
  }, [destinationId, t]);

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
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('destinations.edit.title')}
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
              {destination && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {destination.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {destination.city}, {destination.country}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('destinations.columns.status')}: {destination.isActive ? t('destinations.status.active') : t('destinations.status.inactive')}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {/* Name */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('destinations.fields.name')}
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Country and City */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('destinations.fields.country')}
                    </span>
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('destinations.fields.city')}
                    </span>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                {/* Description */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('destinations.fields.description')}
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </label>

                {/* Image URL */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('destinations.fields.imageUrl')}
                  </span>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                {/* Status */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('destinations.fields.status')}
                  </span>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                      {form.isActive ? t('destinations.status.active') : t('destinations.status.inactive')}
                    </span>
                  </div>
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
            {busy ? t('destinations.edit.saving') : t('destinations.edit.save')}
          </button>

          <button
            onClick={() => {
              if (busy) return;
              close();
            }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={busy}
          >
            {t('destinations.edit.cancel')}
          </button>
        </div>
      </div>
    </>
  );
}
