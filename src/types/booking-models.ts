export interface Booking {
  id: string;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: string;
  travelDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
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
}

export interface BookingResponse {
  data: Booking[];
  resultInfo: any;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}
