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

  const { getRouteState, setRouteState } = useRootRoute();

  const getState = useCallback(
    (key: string) => getRouteState(route.id, key),
    [getRouteState]
  );

  const setState = useCallback(
    (key: string, value: any) => {
      setRouteState(route.id, key, value);
    },
    [setRouteState]
  );

  return (
    <RouteContext.Provider
      value={{ ...route, getState, setState }}
      {...props}
    />
  );
};
