import AddFlight from '@/pages/add-flight';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/add-flight')({
  component: AddFlight,
});
