import { RouteContext } from "@/context/route-context.js";
import { useRootRoute } from "@/hooks/useRootRoute.js";
import type { ParsedRoute } from "@/types.js";
import { useCallback } from "react";

export const RouteProvider = ({
  route,
  ...props
}: {
  route?: ParsedRoute;
  children?: React.ReactNode;
}) => {
  if (!route) {
    return <RouteContext.Provider value={null} {...props} />;
  }

  const rootRoute = useRootRoute();

  const getState = useCallback(
    (key: string) => {
      return rootRoute.getRouteState(route.id, key);
    },
    [rootRoute.getRouteState]
  );

  const setState = useCallback(
    (key: string, value: any) => {
      rootRoute.setRouteState(route.id, key, value);
    },
    [rootRoute.setRouteState]
  );

  return (
    <RouteContext.Provider
      value={{ ...route, getState, setState }}
      {...props}
    />
  );
};
