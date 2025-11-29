import type { DestinationResponse } from "./Destination-models";

export interface PackageResponse {
  id: string;
  destinationId: string;
  title: string;
  description?: string;
  duration: number;
  price: number;
  includedServices?: any;
  imagesUrls?:any
  availableFrom: string;
  availableTo: string;
  maxCapacity: number;
  isActive: boolean;
  destination: DestinationResponse
  createdAt: string;
  updatedAt: string;
}
