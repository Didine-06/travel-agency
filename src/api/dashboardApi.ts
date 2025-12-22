import  axiosClient  from './axiosClient';

export interface DashboardStats {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  consultations: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  tickets: {
    total: number;
    reserved: number;
    paid: number;
    cancelled: number;
    paidPercentage: number;
    unpaidPercentage: number;
  };
  nextAppointment: {
    id: string;
    subject: string;
    consultationDate: string;
    agentName: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  } | null;
}

export interface DashboardCharts {
  bookingsOverTime: Array<{ month: string; value: number }>;
  consultationsOverTime: Array<{ month: string; value: number }>;
  bookingsByStatus: Array<{ status: string; count: number; percentage: number }>;
  ticketsByClass: Array<{ class: string; count: number; percentage: number }>;
  spendingOverTime: Array<{ month: string; amount: number }>;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get('/dashboard/client/stats');
    return response.data.data;
  },

  getCharts: async (): Promise<DashboardCharts> => {
    const response = await axiosClient.get('/dashboard/client/charts');
    return response.data.data;
  },
};
