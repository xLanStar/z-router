import { RootRouteContext } from "@/context/root-route-context.js";
import type { Route } from "@/types.js";
import { parseRoute } from "@/utils.js";
import { useCallback, useState } from "react";

export const RootRouteProvider = ({
  rootRoute,
  ...props
}: {
  rootRoute: Route;
  children: React.ReactNode;
}) => {
  const parsedRoute = parseRoute(rootRoute);
  const [state, setState] = useState<Record<string, Record<string, any>>>({});

  const getRouteState = useCallback(
    (id: string, key: string) => {
      return state[id]?.[key];
    },
    [state]
  );

  const setRouteState = useCallback((id: string, key: string, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [key]: value,
      },
    }));
  }, []);

  return (
    <RootRouteContext.Provider
      value={{ ...parsedRoute, state, getRouteState, setRouteState }}
      {...props}
    />
  );
};
