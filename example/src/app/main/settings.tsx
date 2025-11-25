import { Button } from "@/components/button";
import { Link, useLocation, useRoute } from "@modastar/z-router";
export const SettingsPage = () => {
  const location = useLocation();
  const route = useRoute();

  return (
    <div className="flex flex-col gap-3">
      Settings Page
      <Button
        onClick={() => {
          location.setState("testKey", (location.getState("testKey") ?? 0) + 1);
        }}
      >
        test location state {location.getState("testKey") ?? 0}
      </Button>
      <Button
        onClick={() => {
          route.setState("testKey", (route.getState("testKey") ?? 0) + 1);
        }}
      >
        test route state {route.getState("testKey") ?? 0}
      </Button>
      <Link to="/">
        <Button>Back to Home with absolute path (/)</Button>
      </Link>
      <Link to="..">
        <Button>Back to Home with relative path (..)</Button>
      </Link>
    </div>
  );
};
