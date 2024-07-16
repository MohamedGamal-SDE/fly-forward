import UpdateFlight from '@/pages/update-flight';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/edit-flight/$id')({
  component: UpdateFlight,
});
