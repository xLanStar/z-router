import { useEffect } from "react";

import { RouteContext } from "@/context/routeContext.js";
import { useRouter } from "@/hooks/useRouter.js";
import type { RootRoute } from "@/types.js";
import { parseLocationFromHref } from "@/utils.js";

export const RouteProvider = ({
  rootRoute,
  children,
}: {
  rootRoute: RootRoute;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  useEffect(() => {
    const currentLocation = parseLocationFromHref(
      rootRoute,
      window.location.href
    );
    if (!currentLocation) return;
    router.navigate({
      to: currentLocation.pathname,
      params: currentLocation.params,
      query: currentLocation.query,
    });
    return () => {
      router.back();
    };
  }, []);

  return (
    <RouteContext.Provider value={rootRoute}>{children}</RouteContext.Provider>
  );
};
