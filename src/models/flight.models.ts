export interface FlightRequest {
  code: string; // unique & 6 characters long & only uppercase or lowercase letters
  capacity: number; // between 1 and 200
  departureDate: string;
}

export interface Flight extends FlightRequest {
  id: string; // uuid
  status: FlightStatus;
  img: string;
}

export enum FlightStatus {
  NONE = 'none',
  READY = 'ready',
  PROCESSING = 'processing',
}

export interface FlightsResponse {
  count: number;
  resources: Flight[];
  total: number;
}

export interface FlightPaginatedFetchProps {
  page: number;
  pageSize: number;
}
