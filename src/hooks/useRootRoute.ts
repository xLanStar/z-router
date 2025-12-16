import { useContext } from "react";

import { RootRouteContext } from "../context/root-route-context.js";

export const useRootRoute = () => {
  const route = useContext(RootRouteContext);
  if (route === null) {
    throw new Error("useRootRoute must be used within a RootRouteProvider");
  }
  return route;
};
