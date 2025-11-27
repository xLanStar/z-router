import { Button } from "@heroui/button";
import { Link } from "@heroui/react";

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-3">
      Home Page
      <Button as={Link} href="/settings">
        Go to Settings with absolute path (/settings)
      </Button>
      <Button as={Link} href="settings">
        Go to Settings with relative path (settings)
      </Button>
      <Button as={Link} href="./settings">
        Go to Settings with relative path (./settings)
      </Button>
    </div>
  );
};
