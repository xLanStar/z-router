import { useEffect, useState } from "react";

import { useRouter } from "@/hooks/useRouter.js";
import type { Route } from "@/types.js";

export const RouteComponent = ({
  route,
  children,
}: {
  route: Route;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const [pending, setPending] = useState(!!route.beforeLoad);

  useEffect(() => {
    if (route.beforeLoad) {
      route
        .beforeLoad({ location: router.location! })
        .catch((error: unknown) => {
          if (
            error instanceof Error &&
            typeof error.cause === "object" &&
            error.cause !== null &&
            "to" in error.cause
          ) {
            router.navigate({
              to: (error.cause as any).to,
              replace: (error.cause as any).replace,
            });
          }
        })
        .finally(() => setPending(false));
    }
  }, []);

  if (pending) {
    const PendingComponent = route.pendingComponent!;
    return <PendingComponent />;
  }

  const Component = route.component;
  return Component ? <Component>{children}</Component> : children;
};
