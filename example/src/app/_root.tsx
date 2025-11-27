import { Button } from "@heroui/button";
import { Outlet, useLocation, useRouter } from "@modastar/z-router";
import React from "react";

export const RootLayout: React.FC = () => {
  const router = useRouter();
  const location = useLocation();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="p-3 bg-gray-200 flex items-center gap-3">
        <div className="flex gap-2">
          <Button
            isDisabled={!location.canGoBack}
            onPress={() => router.back()}
          >
            Back
          </Button>
          <Button
            isDisabled={!location.canGoForward}
            onPress={() => router.forward()}
          >
            Forward
          </Button>
        </div>
        Z-Router Example - {location?.index} - {location.href}
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2">
        <Outlet />
      </div>
    </div>
  );
};
