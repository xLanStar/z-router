import { RouteMatchContext } from "@/context/route-match-context.js";
import { useLocation } from "@/hooks/useLocation.js";
import { useRootRoute } from "@/hooks/useRootRoute.js";
import { matchRoute } from "@/utils.js";
import { OutletProvider } from "./outlet-provider.js";
import { Outlet } from "./outlet.js";

export const PageRenderer = () => {
  const rootRoute = useRootRoute();
  const location = useLocation();
  const routeMatch = matchRoute(rootRoute, location.pathname);
  return (
    <RouteMatchContext.Provider value={routeMatch}>
      <OutletProvider depth={0}>
        <Outlet />
      </OutletProvider>
    </RouteMatchContext.Provider>
  );
};
