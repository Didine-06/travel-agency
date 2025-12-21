import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

import { api } from "../../../api";
import type { Consultation } from "../../../types/consultation-models";
import { useConsultationContext } from "./ConsultationContext";
import { X } from "lucide-react";

export default function EditConsultation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { reloadConsultations } = useConsultationContext();

  const consultationId = id ?? "";

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [consultation, setConsultation] = useState<Consultation | null>(null);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    description: "",
    consultationDate: "",
    consultationTime: "",
    duration: 30,
  });

  const close = async () => {
    setOpen(false);
    setTimeout(async () => {
      setMounted(false);
      await reloadConsultations();
      navigate("/client/consultations");
    }, 220);
  };

  const submit = async () => {
    if (!consultationId) return;
    
    // Validate required fields
    if (!form.subject.trim()) {
      setError(t('consultations.edit.errors.subjectRequired'));
      toast.error(t('consultations.edit.errors.subjectRequired'));
      return;
    }

    if (!form.consultationDate || !form.consultationTime) {
      setError(t('consultations.edit.errors.dateTimeRequired'));
      toast.error(t('consultations.edit.errors.dateTimeRequired'));
      return;
    }

    try {
      setBusy(true);
      setError("");

      // Combine date and time into ISO string
      const consultationDateTimeIso = new Date(
        `${form.consultationDate}T${form.consultationTime}:00.000Z`
      ).toISOString();

      const response = await api.consultations.updateMyConsultation(consultationId, {
        subject: form.subject,
        description: form.description || undefined,
        consultationDate: consultationDateTimeIso,
        duration: Number(form.duration),
      });

      toast.success(response.message || t('consultations.edit.updateSuccess'));
      close();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('consultations.edit.updateError');
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!consultationId) return;

    setMounted(true);
    const openTimer = setTimeout(() => setOpen(true), 10);

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.consultations.getMyConsultationById(consultationId);
        if (cancelled) return;

        if (!response.isSuccess || !response.data) {
          setError(
            response.message || t('consultations.edit.loadError')
          );
          setConsultation(null);
          return;
        }

        const consultationData = response.data;
        setConsultation(consultationData);

        // Parse ISO date to date and time inputs
        const consultationDateTime = new Date(consultationData.consultationDate);
        const dateStr = consultationDateTime.toISOString().slice(0, 10);
        const timeStr = consultationDateTime.toISOString().slice(11, 16);

        setForm({
          subject: consultationData.subject || "",
          description: consultationData.description || "",
          consultationDate: dateStr,
          consultationTime: timeStr,
          duration: consultationData.duration ?? 30,
        });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : t('consultations.edit.loadError');
        setError(message);
        setConsultation(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      clearTimeout(openTimer);
      cancelled = true;
    };
  }, [consultationId, t]);

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
              {t('consultations.edit.title')}
            </h2>
          </div>
          <button
            onClick={() => {
              if (busy) return;
              close();
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
            disabled={busy}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
              {consultation && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {consultation.subject}
                  </div>
                  {consultation.agent ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('consultations.edit.agent')}: {consultation.agent.user?.firstName} {consultation.agent.user?.lastName}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">
                      {t('consultations.noAgent')}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('consultations.edit.status')}: {consultation.status}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('consultations.edit.fields.subject')} <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder={t('consultations.edit.placeholders.subject')}
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('consultations.edit.fields.description')}
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder={t('consultations.edit.placeholders.description')}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('consultations.edit.fields.date')} <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="date"
                      value={form.consultationDate}
                      onChange={(e) =>
                        setForm({ ...form, consultationDate: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('consultations.edit.fields.time')} <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="time"
                      value={form.consultationTime}
                      onChange={(e) =>
                        setForm({ ...form, consultationTime: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('consultations.edit.fields.duration')} ({t('consultations.minutes')})
                  </span>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: Number(e.target.value) })
                    }
                    className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('consultations.edit.hints.duration')}
                  </p>
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
            {busy ? t('consultations.edit.saving') : t('consultations.edit.save')}
          </button>

          <button
            onClick={() => {
              if (busy) return;
              close();
            }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={busy}
          >
            {t('consultations.edit.cancel')}
          </button>
        </div>
      </div>
    </>
  );
}
