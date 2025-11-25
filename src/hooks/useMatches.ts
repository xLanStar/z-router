import { matchRoute } from "@/utils.js";

import { useLocation } from "./useLocation.js";
import { useRootRoute } from "./useRootRoute.js";

export const useMatches = () => {
  const route = useRootRoute();
  const location = useLocation();
  if (!location) return [];
  return matchRoute(route, location.pathname)?.matches || [];
};
