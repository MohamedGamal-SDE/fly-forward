import { Flight, FlightRequest } from '@/models';

export function generateRandomFlight(existingFlights: Flight[]): FlightRequest {
  // Generate a random 6-character alphanumeric code
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  // Check if the code is unique among existing flights
  if (!isCodeUnique(code, existingFlights)) {
    return generateRandomFlight(existingFlights);
  }

  // Random capacity between 1 and 200
  const capacity = Math.floor(Math.random() * 200) + 1;

  return {
    code,
    capacity,
    departureDate: '2022-10-28',
  };
}
// Check if the generated code is unique among existing flights
export function isCodeUnique(code: string, existingFlights: Flight[]): boolean {
  return !existingFlights.some((flight) => flight.code === code);
}
