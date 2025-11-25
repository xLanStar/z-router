import { Button } from "@/components/button";
import { Outlet, useLocation, useRouter } from "@modastar/z-router";
import React from "react";

export const MainLayout: React.FC = () => {
  const router = useRouter();
  const location = useLocation();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="p-3 bg-gray-200">
        Z-Router Example - {router.location?.index}
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button disabled={!location.canGoBack} onClick={() => router.back()}>
            Back
          </Button>
          <Button
            disabled={!location.canGoForward}
            onClick={() => router.forward()}
          >
            Forward
          </Button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
