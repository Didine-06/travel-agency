import axiosClient from "./axiosClient";
import type { ApiResponse } from "./ApiResponse";
import type {
  Destination,
  CreateDestinationDto,
  UpdateDestinationDto,
  DestinationResponse,
} from "../types/Destination-models";

export const destinationsApi = {
  // Get all destinations (Public)
  getAllDestinations: async (): Promise<ApiResponse<Destination[]>> => {
    const response = await axiosClient.get("/destinations");
    return response.data;
  },

  // Get destination by ID (Public)
  getDestinationById: async (id: string): Promise<ApiResponse<Destination>> => {
    const response = await axiosClient.get(`/destinations/${id}`);
    return response.data;
  },

  // Create new destination (Agent/Admin)
  createDestination: async (
    data: CreateDestinationDto
  ): Promise<ApiResponse<Destination>> => {
    const response = await axiosClient.post("/destinations", data);
    return response.data;
  },

  // Update destination (Agent/Admin)
  updateDestination: async (
    id: string,
    data: UpdateDestinationDto
  ): Promise<ApiResponse<Destination>> => {
    const response = await axiosClient.patch(`/destinations/${id}`, data);
    return response.data;
  },

  // Delete single destination (Agent/Admin)
  deleteDestination: async (id: string): Promise<ApiResponse<Destination>> => {
    const response = await axiosClient.delete(`/destinations/${id}`);
    return response.data;
  },

  // Delete multiple destinations (Agent/Admin)
  deleteDestinations: async (ids: string[]): Promise<ApiResponse<any>> => {
    const response = await axiosClient.delete("/destinations", {
      data: { ids },
    });
    return response.data;
  },

  getAll: async (): Promise<ApiResponse<DestinationResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<DestinationResponse[]>>(
      "/destinations"
    );
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<DestinationResponse>> => {
    const response = await axiosClient.get<ApiResponse<DestinationResponse>>(
      `/destinations/${id}`
    );
    return response.data;
  },
};
