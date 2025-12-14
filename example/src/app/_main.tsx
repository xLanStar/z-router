import { Button, Link } from "@heroui/react";
import { Outlet, useRouteMatch } from "@modastar/z-router";

export const MainLayout = () => {
  const routeMatch = useRouteMatch();
  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          as={Link}
          href="/home"
          color={
            routeMatch.matches.some((match) => match.name === "home-page")
              ? "primary"
              : "default"
          }
        >
          Home
        </Button>
        <Button
          as={Link}
          href="/settings"
          color={
            routeMatch.matches.some((match) => match.name === "settings-page")
              ? "primary"
              : "default"
          }
        >
          Settings
        </Button>
      </div>

      <Outlet />
    </div>
  );
};
