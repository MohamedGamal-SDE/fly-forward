import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const handleFlightsQueryParams = (params: { page?: number; size?: number; code?: string }) => {
  const { page = 1, size = 10, code = undefined } = params;

  return code ? { ...params, page, size, code } : { ...params, page, size };
};

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/flights" className="[&.active]:font-bold" search={handleFlightsQueryParams}>
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
