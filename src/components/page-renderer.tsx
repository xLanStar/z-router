import { RouteMatchContext } from "@/context/route-match-context.js";
import { useLocation } from "@/hooks/useLocation.js";
import { useRootRoute } from "@/hooks/useRootRoute.js";
import { matchRoute } from "@/utils.js";
import { memo, useMemo } from "react";
import { RouteComponent } from "./route-component.js";
import { RouteProvider } from "./route-provider.js";

export const PageRenderer = memo(() => {
  const rootRoute = useRootRoute();
  const location = useLocation();
  const routeMatch = useMemo(
    () => matchRoute(rootRoute, location.pathname),
    [rootRoute, location.pathname]
  );
  return (
    <RouteMatchContext.Provider value={routeMatch}>
      <RouteProvider route={rootRoute}>
        <RouteComponent />
      </RouteProvider>
    </RouteMatchContext.Provider>
  );
});
