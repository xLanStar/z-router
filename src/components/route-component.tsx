import { useEffect } from "react";
import { useLocation } from "../hooks/useLocation.js";
import { useRoute } from "../hooks/useRoute.js";
import { useRouteMatch } from "../hooks/useRouteMatch.js";
import { useRouter } from "../hooks/useRouter.js";
import { Outlet } from "./outlet.js";

export const RouteComponent = ({ depth = 0 }: { depth?: number }) => {
  const router = useRouter();
  const location = useLocation();
  const routeMatch = useRouteMatch();
  const route = useRoute();

  const pendingStateKey = `_Z.${route.id}.pending`;
  const pending =
    !!route.beforeLoad && route.getState(pendingStateKey) !== false;

  useEffect(() => {
    if (!route) {
      return;
    }
    if (route.beforeLoad && route.getState(pendingStateKey) === undefined) {
      route.setState(pendingStateKey, true);
      route
        .beforeLoad?.({ location })
        .then(() => route.setState(pendingStateKey, false))
        .catch(({ cause }: Error) => {
          if (!!cause && "to" in (cause as any)) {
            console.log("Redirecting to:", (cause as any).to);
            router.navigate({
              ...(cause as any),
              onFinish: () => {
                route.setState(pendingStateKey, false);
              },
            });
          } else {
            route.setState(pendingStateKey, false);
          }
        });
    }
  }, [route]);

  if (!route) {
    return null;
  }

  if (pending) {
    const PendingComponent = route.pendingComponent!;
    return <PendingComponent />;
  }

  if (depth >= routeMatch.matches.length) {
    const NotFoundComponent = route.notFoundComponent!;
    return <NotFoundComponent />;
  }

  const Component = route.component;
  return Component ? <Component /> : <Outlet />;
};
