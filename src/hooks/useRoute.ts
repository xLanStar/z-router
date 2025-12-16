import { useContext } from "react";
import { RouteContext } from "../context/route-context.js";

export const useRoute = () => {
  const route = useContext(RouteContext);
  if (route === null) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return route;
};
