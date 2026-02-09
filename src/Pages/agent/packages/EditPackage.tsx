import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { api } from '../../../api';
import type { PackageResponse } from '../../../types/Package-models';
import type { Destination } from '../../../types/Destination-models';
import { usePackageContext } from './PackageContext';

export default function EditPackage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { reloadPackages } = usePackageContext();

  const packageId = id ?? '';

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [pkg, setPkg] = useState<PackageResponse | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

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

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setMounted(false);
      await reloadPackages();
      navigate('/agent/packages');
    }, 220);
  };

  const submit = async () => {
    if (!packageId) return;
    try {
      setBusy(true);
      setError('');

      const response = await api.agentPackages.update(packageId, {
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
        toast.success(response.message || t('agentPackages.edit.success'));
        close();
      } else {
        const message = response?.message || t('agentPackages.edit.error');
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('agentPackages.edit.error');
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!packageId) return;

    setMounted(true);
    const openTimer = setTimeout(() => setOpen(true), 10);

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [pkgRes, destRes] = await Promise.all([
          api.agentPackages.getById(packageId),
          api.destinations.getAllDestinations(),
        ]);
        if (cancelled) return;

        if (destRes.isSuccess && destRes.data) setDestinations(destRes.data);

        if (!pkgRes.isSuccess || !pkgRes.data) {
          setError(pkgRes.message || t('agentPackages.edit.loadError'));
          setPkg(null);
          return;
        }

        const data = pkgRes.data;
        setPkg(data);
        setForm({
          destinationId: data.destinationId,
          title: data.title,
          description: data.description || '',
          duration: data.duration,
          price: data.price,
          includedServices: Array.isArray(data.includedServices) ? data.includedServices.join(', ') : '',
          imagesUrls: Array.isArray(data.imagesUrls) ? data.imagesUrls.join(', ') : '',
          availableFrom: data.availableFrom?.split('T')[0] || '',
          availableTo: data.availableTo?.split('T')[0] || '',
          maxCapacity: data.maxCapacity,
          isActive: data.isActive,
        });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : t('agentPackages.edit.loadError');
        setError(message);
        setPkg(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      clearTimeout(openTimer);
      cancelled = true;
    };
  }, [packageId, t]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} />

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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('agentPackages.edit.title')}</h2>
          <button onClick={() => { if (busy) return; close(); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 dark:text-gray-400" disabled={busy}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {loading ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('common.loading')}</div>
          ) : (
            <>
              {pkg && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{pkg.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{pkg.destination?.name} - {pkg.destination?.country}</div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {/* Destination */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.destination')}</span>
                  <select value={form.destinationId} onChange={(e) => setForm({ ...form, destinationId: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {destinations.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.city}, {d.country})</option>)}
                  </select>
                </label>

                {/* Title */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.title')}</span>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>

                {/* Description */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.description')}</span>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </label>

                {/* Duration & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.duration')}</span>
                    <input type="number" min="1" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.price')}</span>
                    <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                </div>

                {/* Included Services */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.includedServices')}</span>
                  <input type="text" value={form.includedServices} onChange={(e) => setForm({ ...form, includedServices: e.target.value })} placeholder={t('agentPackages.fields.includedServicesPlaceholder')} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>

                {/* Images URLs */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.imagesUrls')}</span>
                  <input type="text" value={form.imagesUrls} onChange={(e) => setForm({ ...form, imagesUrls: e.target.value })} placeholder={t('agentPackages.fields.imagesUrlsPlaceholder')} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>

                {/* Available From/To */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.availableFrom')}</span>
                    <input type="date" value={form.availableFrom} onChange={(e) => setForm({ ...form, availableFrom: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.availableTo')}</span>
                    <input type="date" value={form.availableTo} onChange={(e) => setForm({ ...form, availableTo: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                </div>

                {/* Max Capacity & Active */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.maxCapacity')}</span>
                    <input type="number" min="1" value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('agentPackages.fields.isActive')}</span>
                    <div className="flex items-center mt-2">
                      <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                      <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{form.isActive ? t('agentPackages.status.active') : t('agentPackages.status.inactive')}</span>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-start gap-3">
          <button onClick={submit} disabled={busy || loading} className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {busy ? t('agentPackages.edit.saving') : t('agentPackages.edit.save')}
          </button>
          <button onClick={() => { if (busy) return; close(); }} className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" disabled={busy}>
            {t('agentPackages.edit.cancel')}
          </button>
        </div>
      </div>
    </>
  );
}
