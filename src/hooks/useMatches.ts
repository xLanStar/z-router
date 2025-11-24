import { matchRoute } from "@/utils.js";

import { useLocation } from "./useLocation.js";
import { useRoute } from "./useRoute.js";

export const useMatches = () => {
  const route = useRoute();
  const location = useLocation();
  if (!location) return [];
  return matchRoute(route, location.pathname)?.matches || [];
};
