import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link
          to="/flights"
          className="[&.active]:font-bold"
          search={(params) => ({ ...params, page: params.page || 1, size: params.size || 10, code: params.code || undefined })}>
          Flights
        </Link>{' '}
        <Link to="/add-flight" className="[&.active]:font-bold">
          Add Flight
        </Link>
      </div>
      <hr />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
