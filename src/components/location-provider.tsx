import { memo, useCallback, useMemo } from "react";
import { LocationContext } from "../context/location-context.js";
import { useRouter } from "../hooks/useRouter.js";
import type { Location } from "../types.js";

export const LocationProvider = memo(
  ({
    location,
    ...props
  }: {
    location: Location;
    children: React.ReactNode;
  }) => {
    const router = useRouter();
    const state = useMemo(() => location.state, [location]);
    const setState = useCallback(
      (key: string, value: any) => {
        router.setLocationState(location.index, (prev) => ({
          ...prev,
          [key]: value,
        }));
      },
      [router, location]
    );
    const deleteState = useCallback(
      (key: string) => {
        router.setLocationState(location.index, (prev) => {
          delete prev[key];
          return prev;
        });
      },
      [router, location]
    );
    const setSearch = useCallback(
      (key: string, value: string) => {
        router.setLocationSearch(location.index, {
          ...location.search,
          [key]: value,
        });
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
          state,
          setState,
          deleteState,
          setSearch,
        }}
        {...props}
      />
    );
  },
  (a, b) => a.location === b.location
);
