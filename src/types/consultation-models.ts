// Consultation types based on API documentation

export type ConsultationStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Customer {
  id: string;
  userId: string;
  phone?: string;
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface Agent {
  id: string;
  userId: string;
  phone?: string;
  specialty?: string;
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface Consultation {
  id: string;
  customerId: string;
  agentId?: string;
  subject: string;
  description?: string;
  consultationDate: string;
  duration: number;
  status: ConsultationStatus;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  agent?: Agent;
}

export interface CreateConsultationDto {
  subject: string;
  description?: string;
  consultationDate: string;
  duration?: number;
}

export interface UpdateConsultationDto {
  subject?: string;
  description?: string;
  consultationDate?: string;
  duration?: number;
}

export interface CancelConsultationDto {
  cancellationReason: string;
}

export interface ConsultationListResponse {
  data: Consultation[];
  total: number;
  page: number;
  limit: number;
}
