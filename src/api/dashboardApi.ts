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

export interface AgentDashboardStats {
  consultations: {
    total: number;
    pending: number;
    assignedToMe: number;
    completed: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  packages: {
    total: number;
    active: number;
  };
  nextAppointment: {
    id: string | null;
    subject: string | null;
    consultationDate: string | null;
    customerName: string | null;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | null;
  };
}

export interface AgentDashboardCharts {
  consultationsByStatus: Array<{ status: string; count: number; percentage: number }>;
  bookingsByStatus: Array<{ status: string; count: number; percentage: number }>;
  consultationsOverTime: Array<{ month: string; count: number }>;
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

  getAgentStats: async (): Promise<AgentDashboardStats> => {
    const response = await axiosClient.get('/dashboard/agent/stats');
    return response.data.data;
  },

  getAgentCharts: async (): Promise<AgentDashboardCharts> => {
    const response = await axiosClient.get('/dashboard/agent/charts');
    return response.data.data;
  },
};
