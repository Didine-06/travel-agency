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
import type { PackageResponse } from "../types/Package-models";

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

  destinations: {
    getAll: async (): Promise<ApiResponse<DestinationResponse[]>> => {
      const response = await axiosClient.get<
        ApiResponse<DestinationResponse[]>
      >("/destinations");
      return response.data;
    },
    getById: async (id: string): Promise<ApiResponse<DestinationResponse>> => {
      const response = await axiosClient.get<ApiResponse<DestinationResponse>>(
        `/destinations/${id}`
      );
      return response.data;
    },
  },
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
};

// Export axios client for custom requests if needed
export { axiosClient };
