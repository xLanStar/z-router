import { useOutlet } from "@/hooks/useOutlet.js";
import { useRouteMatch } from "@/hooks/useRouteMatch.js";
import { OutletProvider } from "./outlet-provider.js";
import { RouteComponent } from "./route-component.js";
import { RouteProvider } from "./route-provider.js";

export const Outlet = () => {
  const routeMatch = useRouteMatch();
  const depth = useOutlet() + 1;
  return (
    <OutletProvider depth={depth}>
      <RouteProvider route={routeMatch.matches.at(depth)}>
        <RouteComponent depth={depth} />
      </RouteProvider>
    </OutletProvider>
  );
};
