import { Button } from "@/components/button";
import { Outlet, useRouter } from "@modastar/z-router";
import React from "react";

export const MainLayout: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="p-3 bg-gray-200">
        Z-Router Example - {router.location?.index}
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button disabled={!router.canGoBack} onClick={() => router.back()}>
            Back
          </Button>
          <Button
            disabled={!router.canGoForward}
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
