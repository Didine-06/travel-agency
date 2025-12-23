import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import { Calendar, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface NextAppointment {
  id: string;
  subject: string;
  consultationDate: string;
  agentName: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

interface NextAppointmentCardProps {
  appointment: NextAppointment | null;
}

const statusConfig = {
  CONFIRMED: {
    label: 'Confirmé',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
  },
  PENDING: {
    label: 'En attente',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: AlertCircle,
  },
  CANCELLED: {
    label: 'Annulé',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: AlertCircle,
  },
};

export const NextAppointmentCard: React.FC<NextAppointmentCardProps> = ({ appointment }) => {
  const { t, i18n } = useTranslation();

  const statusConfig = {
    CONFIRMED: {
      label: t('dashboard.status.confirmed'),
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      icon: CheckCircle,
    },
    PENDING: {
      label: t('dashboard.status.pending'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      icon: AlertCircle,
    },
    CANCELLED: {
      label: t('dashboard.status.cancelled'),
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      icon: AlertCircle,
    },
  };

  if (!appointment || !appointment.id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-center py-8 text-gray-400 dark:text-gray-500">
          <Calendar className="w-8 h-8 mr-3" />
          <span className="text-lg">Aucun rendez-vous prévu</span>
        </div>
      </motion.div>
    );
  }

  const config = statusConfig[appointment.status];
  const StatusIcon = config.icon;
  
  const dateLocale = i18n.language === 'ar' ? ar : i18n.language === 'en' ? enUS : fr;
  const formattedDate = format(new Date(appointment.consultationDate), "d MMMM yyyy 'à' HH'h'mm", {
    locale: dateLocale,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-sm p-6 border border-blue-100 dark:border-blue-800/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
          {t('dashboard.nextAppointment.title')}
        </h3>
        <span
          className={clsx(
            'flex items-center px-3 py-1 rounded-full text-sm font-semibold',
            config.bgColor,
            config.color
          )}
        >
          <StatusIcon className="w-4 h-4 mr-1" />
          {config.label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start">
          <div className="text-2xl mr-3">📍</div>
          <div>
            <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">{t('dashboard.nextAppointment.subject')}</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{appointment.subject}</div>
          </div>
        </div>

        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
          <div>
            <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">{t('dashboard.nextAppointment.dateTime')}</div>
            <div className="text-md font-medium text-gray-700 dark:text-gray-300">{formattedDate}</div>
          </div>
        </div>

        <div className="flex items-center">
          <User className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
          <div>
            <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">{t('dashboard.nextAppointment.agent')}</div>
            <div className="text-md font-medium text-gray-700 dark:text-gray-300">{appointment.agentName}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
          {t('dashboard.nextAppointment.viewDetails')}
        </button>
        <button className="flex-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium border border-blue-200 dark:border-blue-800">
          {t('dashboard.nextAppointment.modify')}
        </button>
      </div>
    </motion.div>
  );
};
