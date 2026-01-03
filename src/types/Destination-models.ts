export interface DestinationResponse {
  id: number;
  name: string;
  country: string;
  city: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDestinationDto {
  name: string;
  country: string;
  city: string;
  description: string;
  imageUrl: string;
}

export interface UpdateDestinationDto {
  name?: string;
  country?: string;
  city?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export type Destination = DestinationResponse;
