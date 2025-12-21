import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export type ConfirmCancelModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void | Promise<void>;
  entityLabel: string;
  loading?: boolean;
};

const ConfirmCancelModal = ({
  open,
  onClose,
  onConfirm,
  entityLabel,
  loading = false,
}: ConfirmCancelModalProps) => {
  const { t } = useTranslation();
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!cancelReason.trim()) {
      setError("La raison d'annulation est obligatoire");
      return;
    }
    onConfirm(cancelReason);
  };

  const handleClose = () => {
    if (!loading) {
      setCancelReason("");
      setError("");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-cancel-title"
        className="relative w-[92vw] max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl"
      >
        <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2
                id="confirm-cancel-title"
                className="text-base font-semibold text-gray-900 dark:text-gray-100"
              >
                Annuler {entityLabel}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Action irréversible
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            Veuillez indiquer la raison de l'annulation de ce {entityLabel}.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Raison d'annulation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                setError("");
              }}
              placeholder="Ex: Changement de plan de voyage, problème de santé..."
              rows={4}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            {error && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <p className="text-xs text-orange-800 dark:text-orange-400">
              <strong>Note:</strong> Une fois annulé, ce billet ne pourra plus
              être modifié. Seule la suppression sera possible.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !cancelReason.trim()}
            className="h-9 px-4 text-sm font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Annulation..." : "Confirmer l'annulation"}
          </button>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="h-9 px-4 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelModal;
