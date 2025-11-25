import { Button } from "@/components/button";
import { Link } from "@modastar/z-router";

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-3">
      Home Page
      <Link to="/settings">
        <Button>Go to Settings with absolute path (/settings)</Button>
      </Link>
      <Link to="settings">
        <Button>Go to Settings with relative path (settings)</Button>
      </Link>
      <Link to="./settings">
        <Button>Go to Settings with relative path (./settings)</Button>
      </Link>
    </div>
  );
};
