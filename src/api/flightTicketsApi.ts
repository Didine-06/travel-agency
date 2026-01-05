import axiosClient from "./axiosClient";
import type { ApiResponse } from "./ApiResponse";
import type { FlightTicket } from "../types/flight-ticket-models";

export interface CreateFlightTicketDto {
  bookingId: string;
  customerId: string;
  departureDateTime: string;
  arrivalDateTime: string;
  seatClass: "ECONOMY" | "BUSINESS" | "FIRST";
  ticketPrice: number;
  status?: "RESERVED" | "PAID" | "CANCELLED";
}

export interface UpdateFlightTicketDto {
  departureDateTime?: string;
  arrivalDateTime?: string;
  seatClass?: "ECONOMY" | "BUSINESS" | "FIRST";
  ticketPrice?: number;
  status?: "RESERVED" | "PAID" | "CANCELLED";
}

export interface CancelFlightTicketDto {
  cancellationReason: string;
}

export const flightTicketsApi = {
  // Get all flight tickets (Admin/Agent)
  getAllFlightTickets: async (): Promise<ApiResponse<FlightTicket[]>> => {
    const response = await axiosClient.get("/flight-tickets");
    return response.data;
  },

  // Get flight ticket by ID (Admin/Agent)
  getFlightTicketById: async (id: string): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.get(`/flight-tickets/${id}`);
    return response.data;
  },

  // Create new flight ticket (Agent/Admin)
  createFlightTicket: async (
    data: CreateFlightTicketDto
  ): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.post("/flight-tickets", data);
    return response.data;
  },

  // Update flight ticket (Agent/Admin)
  updateFlightTicket: async (
    id: string,
    data: UpdateFlightTicketDto
  ): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.patch(`/flight-tickets/${id}`, data);
    return response.data;
  },

  // Delete single flight ticket (Agent/Admin)
  deleteFlightTicket: async (id: string): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.delete(`/flight-tickets/${id}`);
    return response.data;
  },

  // Delete multiple flight tickets (Agent/Admin)
  deleteFlightTickets: async (ids: string[]): Promise<ApiResponse<any>> => {
    const response = await axiosClient.delete("/flight-tickets", {
      data: { ids },
    });
    return response.data;
  },

  // Cancel flight ticket (Admin/Agent)
  cancelFlightTicket: async (
    id: string,
    data: CancelFlightTicketDto
  ): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.patch(`/flight-tickets/${id}/cancel`, data);
    return response.data;
  },

  // Mark flight ticket as paid (Admin/Agent)
  markAsPaid: async (id: string): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.patch(`/flight-tickets/${id}/mark-as-paid`);
    return response.data;
  },

  // ===== Client-specific endpoints =====

  // Get my flight tickets (Client)
  getMyTickets: async (): Promise<ApiResponse<FlightTicket[]>> => {
    const response = await axiosClient.get("/flight-tickets/my-tickets");
    return response.data;
  },

  // Create my flight ticket (Client)
  createMyTicket: async (data: {
    bookingId: string;
    departureDateTime: string;
    arrivalDateTime: string;
    seatClass: "ECONOMY" | "BUSINESS" | "FIRST";
    ticketPrice: number;
  }): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.post("/flight-tickets/my-tickets", data);
    return response.data;
  },

  // Update my flight ticket (Client)
  updateMyTicket: async (
    id: string,
    data: UpdateFlightTicketDto
  ): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.patch(`/flight-tickets/my-tickets/${id}`, data);
    return response.data;
  },

  // Delete single my flight ticket (Client)
  deleteMyTicket: async (id: string): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.delete(`/flight-tickets/my-tickets/${id}`);
    return response.data;
  },

  // Delete multiple my flight tickets (Client)
  deleteMyTickets: async (ids: string[]): Promise<ApiResponse<any>> => {
    const response = await axiosClient.delete("/flight-tickets/my-tickets", {
      data: { ids },
    });
    return response.data;
  },

  // Cancel my flight ticket (Client)
  cancelMyTicket: async (
    id: string,
    data: { cancelReason: string }
  ): Promise<ApiResponse<FlightTicket>> => {
    const response = await axiosClient.patch(`/flight-tickets/my-tickets/${id}/cancel`, data);
    return response.data;
  },


    // Get a specific flight ticket by ID
    getMyTicketById: async (id: string): Promise<ApiResponse<FlightTicket>> => {
      const response = await axiosClient.get<ApiResponse<FlightTicket>>(
        `/flight-tickets/my-tickets/${id}`
      );
      return response.data;
    },
};
