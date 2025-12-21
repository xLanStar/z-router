import { Button } from "@heroui/button";
import { Link } from "@heroui/react";
import { TransitionType } from "@modastar/z-router";

export const HomePage = () => {
  console.log("HomePage Rendered");
  return (
    <div className="flex flex-col gap-3">
      Home Page
      <Button
        as={Link}
        href="/settings"
        routerOptions={{
          transitionType: TransitionType,
        }}
      >
        Go to Settings with absolute path (/settings)
      </Button>
      <Button as={Link} href="../settings">
        Go to Settings with relative path (../settings)
      </Button>
    </div>
  );
};
