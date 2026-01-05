// Customer related types and interfaces

export interface Customer {
  id: string;
  userId: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface CustomerResponse {
  data: Customer[];
  resultInfo: any;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}
