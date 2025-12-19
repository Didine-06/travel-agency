import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  /** i18n key or display string describing what is being deleted (e.g., 'Booking', 'User') */
  entityLabel: string;
  /** For pluralization (e.g., bulk delete) */
  count?: number;
  loading?: boolean;
};

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  entityLabel,
  count = 1,
  loading = false,
}: ConfirmDeleteModalProps) => {
  const { t } = useTranslation();



  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        className="relative w-[92vw] max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl"
      >
        <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2
                id="confirm-delete-title"
                className="text-base font-semibold text-gray-900 dark:text-gray-100"
              >
                {t('common.confirmDelete.title')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('common.confirmDelete.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {t('common.confirmDelete.message', { count, entity: entityLabel })}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={loading ? undefined : onClose}
            className="h-9 px-4 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            className="h-9 px-4 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? t('common.deleting') : t('common.confirmDelete.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
