import { useContext } from "react";

import { RouteContext } from "@/context/routeContext.js";

export const useRoute = () => {
  const route = useContext(RouteContext);
  if (route === null) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return route;
};
