export interface Flight {
  code: string; // unique & 6 characters long & only uppercase or lowercase letters
  capacity: number; // between 1 and 200
  departureDate: Date;
  status: FlightStatus;
  img: FlightImg;
}

export interface FlightImg {
  id: number;
  url: string;
  alt: string;
}

export type FlightStatus = 'none' | 'ready' | 'processing';

export interface FlightsResponse {
  count: number;
  resources: Flight[];
  total: number;
}
