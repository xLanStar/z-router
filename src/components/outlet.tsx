import { useLocation } from "@/hooks/useLocation.js";
import { useOutlet } from "@/hooks/useOutlet.js";
import { useRoute } from "@/hooks/useRoute.js";
import { useRouteMatch } from "@/hooks/useRouteMatch.js";
import { useRouter } from "@/hooks/useRouter.js";
import { useEffect, useState } from "react";
import { OutletProvider } from "./outlet-provider.js";

export const Outlet = () => {
  const router = useRouter();
  const location = useLocation();
  const routeMatch = useRouteMatch();
  const depth = useOutlet();
  const route = useRoute();

  const [pending, setPending] = useState(!!route?.beforeLoad);

  useEffect(() => {
    if (route?.beforeLoad) {
      route
        .beforeLoad({ location })
        .catch(({ cause }: Error) => {
          if ("to" in (cause as any)) {
            router.navigate(cause as any);
          }
        })
        .finally(() => setPending(false));
    }
  }, []);

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
  return (
    <OutletProvider depth={depth + 1}>
      {Component ? <Component /> : <Outlet />}
    </OutletProvider>
  );
};
