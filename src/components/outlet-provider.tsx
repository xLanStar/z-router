import { OutletContext } from "@/context/outlet-context.js";
import { RouteContext } from "@/context/route-context.js";
import { useRoute } from "@/hooks/useRoute.js";
import { useRouteMatch } from "@/hooks/useRouteMatch.js";

export const OutletProvider = ({
  depth,
  ...props
}: {
  depth: number;
  children?: React.ReactNode;
}) => {
  const route = useRoute();
  const routeMatch = useRouteMatch();
  return (
    <OutletContext.Provider value={depth}>
      <RouteContext.Provider
        value={routeMatch.matches.at(depth) ?? (depth ? null : route)}
        {...props}
      />
    </OutletContext.Provider>
  );
};
