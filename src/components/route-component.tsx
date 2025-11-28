import { useLocation } from "@/hooks/useLocation.js";
import { useRoute } from "@/hooks/useRoute.js";
import { useRouteMatch } from "@/hooks/useRouteMatch.js";
import { useRouter } from "@/hooks/useRouter.js";
import { useEffect, useState } from "react";
import { Outlet } from "./outlet.js";

export const RouteComponent = ({ depth = 0 }: { depth?: number }) => {
  const router = useRouter();
  const location = useLocation();
  const routeMatch = useRouteMatch();
  const route = useRoute();

  const pendingStateKey = `_Z.${route.id}.pending`;

  const [pending, setPending] = useState(
    !!route?.beforeLoad && route?.getState(pendingStateKey) !== false
  );

  useEffect(() => {
    if (!route || depth >= routeMatch.matches.length) {
      return;
    }
    if (
      pending &&
      route?.beforeLoad &&
      route.getState(pendingStateKey) !== true
    ) {
      route.setState(pendingStateKey, true);
      route
        .beforeLoad({ location })
        .catch(({ cause }: Error) => {
          if (!!cause && "to" in (cause as any)) {
            router.navigate(cause as any);
          }
        })
        .finally(() => {
          route.setState(pendingStateKey, false);
          setPending(false);
        });
    }
  }, [route]);

  if (!route) {
    return null;
  }

  if (depth >= routeMatch.matches.length) {
    const NotFoundComponent = route.notFoundComponent!;
    return <NotFoundComponent />;
  }

  if (pending) {
    const PendingComponent = route.pendingComponent!;
    return <PendingComponent />;
  }

  const Component = route.component;
  return Component ? <Component /> : <Outlet />;
};
