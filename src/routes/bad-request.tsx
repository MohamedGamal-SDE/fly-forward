import BadRequest from '@/pages/errors/bad-request';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/bad-request')({
  component: BadRequest,
});
