import axiosClient from "./axiosClient";
import type { ApiResponse } from "./ApiResponse";
import type { Customer } from "../types/customer-models";

export const customersApi = {
  // Get all customers
  getAllCustomers: async (): Promise<ApiResponse<Customer[]>> => {
    const response = await axiosClient.get("/customers");
    return response.data;
  },
};
