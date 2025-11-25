import { Button } from "@/components/button";
import { Link } from "@modastar/z-router";
export const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-3">
      Settings Page
      <Link to="/">
        <Button>Back to Home with absolute path (/)</Button>
      </Link>
      <Link to="..">
        <Button>Back to Home with relative path (..)</Button>
      </Link>
    </div>
  );
};
