export type TicketStatus = 'RESERVED' | 'PAID' | 'CANCELLED';
export type SeatClass = 'ECONOMY' | 'BUSINESS' | 'FIRST';

export interface FlightTicket {
  id: string;
  customerId: string;
  departureDateTime: string;
  arrivalDateTime: string;
  seatClass: SeatClass;
  ticketPrice: string;
  status: TicketStatus;
  airline?: string;
  attachmentPath?: string;
  issuedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface FlightTicketResponse {
  data: FlightTicket[];
  resultInfo: any;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}
