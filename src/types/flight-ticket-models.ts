export type TicketStatus = 'RESERVED' | 'PAID' | 'CANCELLED';
export type SeatClass = 'ECONOMY' | 'BUSINESS' | 'FIRST';

export interface FlightTicket {
  id: string;
  customerId: string;
  departureDateTime: string;
  returnDate: string | null;
  isRoundTrip: boolean;
  seatClass: SeatClass;
  ticketPrice: string;
  status: TicketStatus;
  airline: string;
  attachmentPath?: string;
  issuedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  customer?: {
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
    };
  };
}

export interface FlightTicketResponse {
  data: FlightTicket[];
  resultInfo: any;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}
