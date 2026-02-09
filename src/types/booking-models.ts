export interface Booking {
  id: string;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: string;
  travelDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  bookingDate: string;
  package: {
    id: string;
    title: string;
    price: string;
    duration: number;
    destination: {
      name: string;
      country: string;
      city: string;
    };
  };
  customer?: {
    id: string;
    phone?: string;
    user?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
}

export interface BookingResponse {
  data: Booking[];
  resultInfo: any;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

export interface CreateBookingDto {
  customerId: string;
  packageId: string;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;
  travelDate: string;
}

export interface UpdateBookingDto {
  numberOfAdults?: number;
  numberOfChildren?: number;
  totalPrice?: number;
  travelDate?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export interface CancelBookingDto {
  cancellationReason: string;
}
