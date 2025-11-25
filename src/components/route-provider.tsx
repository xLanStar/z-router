import { RouteContext } from "@/context/route-context.js";
import type { Route } from "@/types.js";

export const RouteProvider = ({
  route,
  ...props
}: {
  route: Route;
  children?: React.ReactNode;
}) => <RouteContext.Provider value={route} {...props} />;
