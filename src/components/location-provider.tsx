import { LocationContext } from "@/context/location-context.js";
import { useRouter } from "@/hooks/useRouter.js";
import type { Location } from "@/types.js";
import { memo, useCallback } from "react";

export const LocationProvider = memo(
  ({
    location,
    ...props
  }: {
    location: Location;
    children: React.ReactNode;
  }) => {
    const router = useRouter();
    const getState = useCallback(
      (key: string) => {
        return location.state[key];
      },
      [location]
    );
    const setState = useCallback(
      (key: string, value: any) => {
        router.setLocationState(location.index, {
          ...location.state,
          [key]: value,
        });
      },
      [router, location]
    );
    const deleteState = useCallback(
      (key: string) => {
        delete location.state[key];
        router.setLocationState(location.index, location.state);
      },
      [router, location]
    );
    return (
      <LocationContext.Provider
        value={{
          ...location,
          canGoBack: !router.isTransitioning && location.index > 0,
          canGoForward:
            !router.isTransitioning &&
            location.index + 1 < router.history.length,
          getState,
          setState,
          deleteState,
        }}
        {...props}
      />
    );
  },
  (a, b) => a.location === b.location
);
