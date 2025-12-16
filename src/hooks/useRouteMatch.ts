import { useContext } from "react";
import { RouteMatchContext } from "../context/route-match-context.js";

export const useRouteMatch = () => {
  const routeMatch = useContext(RouteMatchContext);
  if (routeMatch === null) {
    throw new Error("useRouteMatch must be used within a RouteMatchProvider");
  }
  return routeMatch;
};
