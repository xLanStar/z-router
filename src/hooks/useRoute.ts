import { RouteContext } from "@/context/route-context.js";
import { useContext } from "react";

export const useRoute = () => {
  const route = useContext(RouteContext);
  if (route === null) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return route;
};
