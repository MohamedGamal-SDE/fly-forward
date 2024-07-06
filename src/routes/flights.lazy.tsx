import { createLazyFileRoute } from '@tanstack/react-router';

import FlightsList from '@/pages/flights-list/flights-list';

export const Route = createLazyFileRoute('/flights')({
  component: FlightsList,
});
