import { Button } from "@heroui/button";
import { Link } from "@heroui/react";
import { useLocation, useRootRoute, useRoute } from "@modastar/z-router";
export const SettingsPage = () => {
  const location = useLocation();
  const rootRoute = useRootRoute();
  const route = useRoute();

  return (
    <div className="flex flex-col gap-3">
      Settings Page
      <Button
        onPress={() => {
          location.setState("testKey", (location.getState("testKey") ?? 0) + 1);
        }}
      >
        test location state {JSON.stringify(location.state)}
      </Button>
      <Button
        onPress={() => {
          route.setState("testKey", (route.getState("testKey") ?? 0) + 1);
        }}
      >
        test root route state {JSON.stringify(route.state)}
      </Button>
      <Button
        onPress={() => {
          rootRoute.setRouteState(
            rootRoute.id,
            "testKey",
            rootRoute.getRouteState(rootRoute.id, "testKey") ?? 0 + 1
          );
        }}
      >
        test route state {JSON.stringify(rootRoute.state)}
      </Button>
      <Button as={Link} href="/">
        Back to Home with absolute path (/)
      </Button>
      <Button as={Link} href="..">
        Back to Home with relative path (..)
      </Button>
    </div>
  );
};
