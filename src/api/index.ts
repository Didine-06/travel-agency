// API client for backend communication
import type { ApiResponse } from "./ApiResponse";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  User,
} from "../types/auth-models";
import type {
  CreateUserData,
  UpdateUserData,
  UserResponse,
  UsersListResponse,
} from "../types/user-models";
import type { DestinationResponse } from "../types/Destination-models";
import axiosClient from "./axiosClient";
import type { PackageResponse, CreatePackageDto, UpdatePackageDto } from "../types/Package-models";
import type { Booking, CreateBookingDto, UpdateBookingDto, CancelBookingDto } from "../types/booking-models";
import type { FlightTicket, SeatClass } from "../types/flight-ticket-models";
import type {
  Consultation,
  UpdateConsultationDto,
  CancelConsultationDto,
} from "../types/consultation-models";
import { destinationsApi } from "./destinationsApi";
import { flightTicketsApi } from "./flightTicketsApi";
import { customersApi } from "./customersApi";

export type UpdateMyBookingDto = {
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;
  travelDate: string;
};

export type CreateFlightTicketDto = {
  bookingId: string;
  departureDateTime: string;
  arrivalDateTime: string;
  seatClass: SeatClass;
  ticketPrice: number;
};

export type UpdateFlightTicketDto = {
  departureDateTime?: string;
  arrivalDateTime?: string;
  seatClass?: SeatClass;
  ticketPrice?: number;
};

export type CancelFlightTicketDto = {
  cancelReason: string;
};

export const api = {
  auth: {
    login: async (
      credentials: LoginCredentials
    ): Promise<ApiResponse<LoginResponse>> => {
      const response = await axiosClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        credentials
      );

      // Store access token if login successful
      if (response.data.isSuccess && response.data.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
      }

      return response.data;
    },

    register: async (
      userData: RegisterData
    ): Promise<ApiResponse<RegisterResponse>> => {
      const response = await axiosClient.post<ApiResponse<RegisterResponse>>(
        "/auth/register",
        userData
      );
      return response.data;
    },

    logout: async (): Promise<void> => {
      try {
        await axiosClient.post("/auth/logout");
      } catch (error) {
        console.error("Logout API error:", error);
      }
      // Clear token from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },

    getCurrentUser: async (): Promise<ApiResponse<User>> => {
      const response = await axiosClient.get<ApiResponse<User>>("/auth/me");
      return response.data;
    },

    updateProfile: async (
      userId: string,
      profileData: {
        email?: string;
        firstName?: string;
        lastName?: string;
        languageId?: string;
        isActive?: boolean;
        phone?: string;
        address?: string;
        city?: string;
        country?: string;
        dateOfBirth?: string;
      }
    ): Promise<ApiResponse<User>> => {
      const response = await axiosClient.patch<ApiResponse<User>>(
        `/auth/profile/${userId}`,
        profileData
      );
      return response.data;
    },
  },

  users: {
    getAll: async (): Promise<ApiResponse<UsersListResponse>> => {
      const response = await axiosClient.get<ApiResponse<UsersListResponse>>(
        "/users"
      );
      return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<User>> => {
      const response = await axiosClient.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    },

    create: async (
      userData: CreateUserData
    ): Promise<ApiResponse<UserResponse>> => {
      const response = await axiosClient.post<ApiResponse<UserResponse>>(
        "/users",
        userData
      );
      return response.data;
    },

    update: async (
      id: string,
      userData: UpdateUserData
    ): Promise<ApiResponse<UserResponse>> => {
      const response = await axiosClient.put<ApiResponse<UserResponse>>(
        `/users/${id}`,
        userData
      );
      return response.data;
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        `/users/${id}`
      );
      return response.data;
    },
  },

  // Destinations API
  destinations: destinationsApi,

  // Flight Tickets API
  flightTickets: flightTicketsApi,

  // Customers API
  customers: customersApi,

  packages: {
    getAll: async (): Promise<ApiResponse<PackageResponse[]>> => {
      const response = await axiosClient.get<ApiResponse<PackageResponse[]>>(
        "/packages"
      );
      return response.data;
    },
    getById: async (id: string): Promise<ApiResponse<PackageResponse>> => {
      const response = await axiosClient.get<ApiResponse<PackageResponse>>(
        `/packages/${id}`
      );
      return response.data;
    },
  },

  bookings: {
    getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
      const response = await axiosClient.get<ApiResponse<Booking[]>>(
        "/bookings/my-bookings"
      );
      return response.data;
    },

    getMyBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
      const response = await axiosClient.get<ApiResponse<Booking>>(
        `/bookings/my-booking/${id}`
      );
      return response.data;
    },

    // Get bookings for a specific customer (Admin/Agent)
    getCustomerBookings: async (customerId: string): Promise<ApiResponse<Booking[]>> => {
      const response = await axiosClient.get<ApiResponse<Booking[]>>(
        `/bookings/customer/${customerId}`
      );
      return response.data;
    },

    updateMyBooking: async (
      id: string,
      dto: UpdateMyBookingDto
    ): Promise<ApiResponse<Booking>> => {
      const response = await axiosClient.patch<ApiResponse<Booking>>(
        `/bookings/my-booking/${id}`,
        dto
      );
      return response.data;
    },
    deleteMyBooking: async (id: string): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        `/bookings/my-booking/${id}`
      );
      return response.data;
    },

    deleteMyBookings: async (ids: string[]): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        `/bookings/my-bookings`,
        { data: { ids } }
      );
      return response.data;
    },

    deleteBooking: async (id: string): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        `/bookings/${id}`
      );
      return response.data;
    },
  },

  consultations: {
    // Get all consultations for the authenticated client
    getMyConsultations: async (): Promise<ApiResponse<Consultation[]>> => {
      const response = await axiosClient.get<ApiResponse<Consultation[]>>(
        "/consultations/my-consultations"
      );
      return response.data;
    },

    // Get a specific consultation by ID
    getMyConsultationById: async (
      id: string
    ): Promise<ApiResponse<Consultation>> => {
      const response = await axiosClient.get<ApiResponse<Consultation>>(
        `/consultations/my-consultations/${id}`
      );
      return response.data;
    },

    // Update a consultation (only PENDING or CONFIRMED)
    updateMyConsultation: async (
      id: string,
      data: UpdateConsultationDto
    ): Promise<ApiResponse<Consultation>> => {
      const response = await axiosClient.patch<ApiResponse<Consultation>>(
        `/consultations/my-consultations/${id}`,
        data
      );
      return response.data;
    },

    // Cancel a consultation with reason
    cancelMyConsultation: async (
      id: string,
      data: CancelConsultationDto
    ): Promise<ApiResponse<Consultation>> => {
      const response = await axiosClient.patch<ApiResponse<Consultation>>(
        `/consultations/my-consultations/${id}/cancel`,
        data
      );
      return response.data;
    },

    // Delete a consultation
    deleteMyConsultation: async (id: string): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        `/consultations/my-consultations/${id}`
      );
      return response.data;
    },

    // Delete multiple consultations at once
    deleteMyConsultations: async (ids: string[]): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        `/consultations/my-consultations`,
        { data: { ids } }
      );
      return response.data;
    },
  },

  // Agent Consultations API
  agentConsultations: {
    getPending: async (): Promise<ApiResponse<Consultation[]>> => {
      const response = await axiosClient.get(
        "/consultations/pending"
      );
      const body = response.data;
      return {
        ...body,
        data: body.data?.data ?? body.data ?? [],
      };
    },

    getAssignedToMe: async (): Promise<ApiResponse<Consultation[]>> => {
      const response = await axiosClient.get(
        "/consultations/assigned-to-me"
      );
      const body = response.data;
      return {
        ...body,
        data: body.data?.data ?? body.data ?? [],
      };
    },

    assignToMe: async (id: string): Promise<ApiResponse<void>> => {
      const response = await axiosClient.patch<ApiResponse<void>>(
        `/consultations/${id}/assign-to-me`
      );
      return response.data;
    },

    complete: async (id: string): Promise<ApiResponse<void>> => {
      const response = await axiosClient.patch<ApiResponse<void>>(
        `/consultations/${id}/complete`
      );
      return response.data;
    },
  },

  // Agent Bookings API
  agentBookings: {
    getAll: async (): Promise<ApiResponse<Booking[]>> => {
      const response = await axiosClient.get<ApiResponse<Booking[]>>(
        "/bookings"
      );
      return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<Booking>> => {
      const response = await axiosClient.get<ApiResponse<Booking>>(
        `/bookings/${id}`
      );
      return response.data;
    },

    create: async (data: CreateBookingDto): Promise<ApiResponse<Booking>> => {
      const response = await axiosClient.post<ApiResponse<Booking>>(
        "/bookings",
        data
      );
      return response.data;
    },

    update: async (
      id: string,
      data: UpdateBookingDto
    ): Promise<ApiResponse<Booking>> => {
      const response = await axiosClient.patch<ApiResponse<Booking>>(
        `/bookings/${id}`,
        data
      );
      return response.data;
    },

    cancel: async (
      id: string,
      data: CancelBookingDto
    ): Promise<ApiResponse<void>> => {
      const response = await axiosClient.patch<ApiResponse<void>>(
        `/bookings/${id}/cancel`,
        data
      );
      return response.data;
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        `/bookings/${id}`
      );
      return response.data;
    },

    deleteMany: async (ids: string[]): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        "/bookings",
        { data: { ids } }
      );
      return response.data;
    },
  },

  // Agent Packages API
  agentPackages: {
    getAll: async (): Promise<ApiResponse<PackageResponse[]>> => {
      const response = await axiosClient.get<ApiResponse<PackageResponse[]>>(
        "/packages"
      );
      return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<PackageResponse>> => {
      const response = await axiosClient.get<ApiResponse<PackageResponse>>(
        `/packages/${id}`
      );
      return response.data;
    },

    create: async (
      data: CreatePackageDto
    ): Promise<ApiResponse<PackageResponse>> => {
      const response = await axiosClient.post<ApiResponse<PackageResponse>>(
        "/packages",
        data
      );
      return response.data;
    },

    update: async (
      id: string,
      data: UpdatePackageDto
    ): Promise<ApiResponse<PackageResponse>> => {
      const response = await axiosClient.patch<ApiResponse<PackageResponse>>(
        `/packages/${id}`,
        data
      );
      return response.data;
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        `/packages/${id}`
      );
      return response.data;
    },

    deleteMany: async (ids: string[]): Promise<ApiResponse<void>> => {
      const response = await axiosClient.delete<ApiResponse<void>>(
        "/packages",
        { data: { ids } }
      );
      return response.data;
    },
  },

};

// Export axios client for custom requests if needed
export { axiosClient };
