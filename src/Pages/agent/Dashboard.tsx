import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RefreshCw, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { dashboardApi } from '../../api/dashboardApi';
import { StatsCard } from '../../Components/dashboard/StatsCard';
import { NextAppointmentCard } from '../../Components/dashboard/NextAppointmentCard';
import { BookingsStatusDonut } from '../../Components/dashboard/BookingsStatusDonut';
import { ConsultationsStatusDonut } from '../../Components/dashboard/ConsultationsStatusDonut';
import { ConsultationsBarChart } from '../../Components/dashboard/ConsultationsBarChart';

const AgentDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [lastUpdateTime, setLastUpdateTime] = React.useState(new Date());

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['agentStats'],
    queryFn: dashboardApi.getAgentStats,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });

  const {
    data: charts,
    isLoading: chartsLoading,
    error: chartsError,
    refetch: refetchCharts,
  } = useQuery({
    queryKey: ['agentCharts'],
    queryFn: dashboardApi.getAgentCharts,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });

  const handleRefresh = () => {
    refetchStats();
    refetchCharts();
    setLastUpdateTime(new Date());
  };

  const isLoading = statsLoading || chartsLoading;
  const hasError = statsError || chartsError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{t('agentDashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('agentDashboard.error.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('agentDashboard.error.message')}
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
          >
            {t('agentDashboard.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!stats || !charts) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('agentDashboard.noData.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('agentDashboard.noData.message')}
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
          >
            {t('agentDashboard.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  const nextAppointment = stats.nextAppointment?.id
    ? {
        id: stats.nextAppointment.id,
        subject: stats.nextAppointment.subject || '',
        consultationDate: stats.nextAppointment.consultationDate || '',
        agentName: stats.nextAppointment.customerName || '',
        status: stats.nextAppointment.status as 'CONFIRMED' | 'PENDING' | 'CANCELLED',
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4 md:p-8">
      <div className="mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t('agentDashboard.welcome')} 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('agentDashboard.subtitle')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <Clock className="w-4 h-4" />
                <span>{t('dashboard.lastUpdate')} : {lastUpdateTime.toLocaleString(i18n.language === 'ar' ? 'ar-SA' : i18n.language === 'en' ? 'en-US' : 'fr-FR')}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm border border-gray-200 dark:border-gray-700 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                {t('dashboard.refresh')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <StatsCard
            title={t('agentDashboard.stats.pendingConsultations')}
            value={stats.consultations.pending}
            icon="⏳"
            color="#f59e0b"
            subtitle={`${stats.consultations.pending} ${t('agentDashboard.stats.pending')}`}
          />
          <StatsCard
            title={t('agentDashboard.stats.myConsultations')}
            value={stats.consultations.assignedToMe}
            icon="💬"
            color="#8b5cf6"
            subtitle={`${stats.consultations.completed} ${t('agentDashboard.stats.completed')}`}
          />
          <StatsCard
            title={t('agentDashboard.stats.totalBookings')}
            value={stats.bookings.total}
            icon="📅"
            color="#2563eb"
            subtitle={`${stats.bookings.pending} ${t('agentDashboard.stats.pending')}`}
          />
          <StatsCard
            title={t('agentDashboard.stats.activePackages')}
            value={stats.packages.active}
            icon="📦"
            color="#10b981"
            subtitle={`${stats.packages.active} ${t('agentDashboard.stats.active')}`}
          />
        </div>

        {/* Next Appointment Card */}
        <div className="mb-8">
          <NextAppointmentCard appointment={nextAppointment} />
        </div>

        {/* Consultations Over Time - Full Width */}
        <div className="mb-6">
          <ConsultationsBarChart data={charts.consultationsOverTime} />
        </div>

        {/* Charts Grid - Consultations Status and Bookings Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ConsultationsStatusDonut data={charts.consultationsByStatus} />
          <BookingsStatusDonut data={charts.bookingsByStatus} />
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
