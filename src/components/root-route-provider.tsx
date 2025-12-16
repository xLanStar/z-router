import { useCallback, useMemo, useState } from "react";
import { RootRouteContext } from "../context/root-route-context.js";
import type { Route } from "../types.js";
import { parseRoute } from "../utils.js";

export const RootRouteProvider = ({
  route,
  ...props
}: {
  route: Route;
  children: React.ReactNode;
}) => {
  const parsedRoute = useMemo(() => parseRoute(route), [route]);
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
