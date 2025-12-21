import { useCallback, useEffect, useMemo, useState } from "react";

import { TransitionType } from "@/constants.js";
import { RouterContext } from "@/context/router-context.js";
import type {
  BackActionOptions,
  ForwardActionOptions,
  Location,
  NavigateActionOptions,
  NavigationOptions,
  RouterOptions,
} from "@/types.js";
import {
  buildUrlFromLocation,
  parseLocation,
  resolveRelativeUrl,
} from "@/utils.js";
import { LocationProvider } from "./location-provider.js";

export const RouterProvider = ({
  options,
  ...props
}: {
  options: RouterOptions;
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<Location[]>([
    parseLocation(window.location),
  ]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const location = useMemo(
    () => history.at(currentLocationIndex)!,
    [history, currentLocationIndex]
  );
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitioningToLocation, setTransitioningToLocation] =
    useState<Location>();
  const [transitionType, setTransitionType] = useState<TransitionType>();
  const [transitionDuration, setTransitionDuration] = useState<number>(0);

  const canGoBack = !isTransitioning && currentLocationIndex > 0;
  const canGoForward =
    !isTransitioning && currentLocationIndex + 1 < history.length;

  useEffect(() => {
    window.history.replaceState(
      location.state,
      "",
      buildUrlFromLocation(location)
    );
  }, []);

  useEffect(() => {
    const handlePopState = ({ state }: PopStateEvent) => {
      setCurrentLocationIndex(state?.index);
    };

    addEventListener("popstate", handlePopState);
    return () => {
      removeEventListener("popstate", handlePopState);
    };
  }, [currentLocationIndex]);

  // Utilities
  const buildLocation = useCallback(
    ({ to, replace }: NavigationOptions): Location => {
      if (!to) return location;
      const index = replace ? currentLocationIndex : currentLocationIndex + 1;

      // Resolve to with absolute or relative paths like ".." or "."
      const url = to.startsWith("/")
        ? to
        : resolveRelativeUrl(location.pathname, to);
      const [pathname, search] = url.split("?");
      const searchParams = new URLSearchParams(search ?? "");
      const state = {
        index,
      };
      return {
        index,
        href: origin + pathname + (search ? `?${searchParams.toString()}` : ""),
        search: Object.fromEntries(searchParams.entries()),
        state,
        pathname,
      };
    },
    [currentLocationIndex, location]
  );

  // Transition helper
  const transitionTo = (
    location: Location,
    transitionType: TransitionType,
    duration: number = options.defaultTransitionDuration,
    callback?: () => void
  ) => {
    setIsTransitioning(true);
    setTransitionType(transitionType);
    setTransitionDuration(duration);
    setTransitioningToLocation(location);
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionType(undefined);
      setTransitioningToLocation(undefined);
      callback?.();
    }, duration);
  };

  // Navigation actions
  const navigate = useCallback(
    ({
      to,
      replace,
      transitionType,
      duration,
      onFinish,
    }: NavigateActionOptions) => {
      if (isTransitioning) return;

      const index = replace ? currentLocationIndex : currentLocationIndex + 1;
      const newLocation = buildLocation({ to, replace });

      const updateHistory = () => {
        if (replace) {
          setHistory((prevHistory) => [
            ...prevHistory.slice(0, index),
            newLocation,
            ...prevHistory.slice(index + 1),
          ]);
          window.history.replaceState(
            newLocation.state,
            "",
            buildUrlFromLocation(newLocation)
          );
        } else {
          setHistory((prevHistory) => [
            ...prevHistory.slice(0, index),
            newLocation,
          ]);
          setCurrentLocationIndex(index);
          window.history.pushState(
            newLocation.state,
            "",
            buildUrlFromLocation(newLocation)
          );
        }
        onFinish?.();
      };

      const finalTransitionType =
        transitionType ??
        options.defaultTransitionType?.(location, newLocation) ??
        TransitionType.SlideLeft;
      if (
        finalTransitionType &&
        finalTransitionType !== TransitionType.NoTransition
      ) {
        transitionTo(newLocation, finalTransitionType, duration, updateHistory);
      } else {
        updateHistory();
      }
    },
    [currentLocationIndex, history, isTransitioning, options]
  );

  const back = useCallback(
    ({ transitionType, duration, onFinish, depth }: BackActionOptions = {}) => {
      if (!canGoBack) return;
      const backDepth = depth ?? 1;
      const newLocation = history.at(currentLocationIndex - backDepth);
      if (!newLocation) return;

      const updateHistory = () => {
        window.history.go(-backDepth);
        onFinish?.();
      };

      const finalTransitionType =
        transitionType ??
        options.defaultTransitionType?.(location, newLocation) ??
        TransitionType.SlideRight;
      if (
        finalTransitionType &&
        finalTransitionType !== TransitionType.NoTransition
      ) {
        transitionTo(newLocation, finalTransitionType, duration, updateHistory);
      } else {
        updateHistory();
      }
    },
    [currentLocationIndex, history, isTransitioning, options]
  );

  const forward = useCallback(
    ({
      transitionType,
      duration,
      depth,
      onFinish,
    }: ForwardActionOptions = {}) => {
      if (!canGoForward) return;
      const forwardDepth = depth ?? 1;
      const newLocation = history.at(currentLocationIndex + forwardDepth);
      if (!newLocation) return;

      const updateHistory = () => {
        window.history.go(forwardDepth);
        onFinish?.();
      };
      const finalTransitionType =
        transitionType ??
        options.defaultTransitionType?.(location, newLocation) ??
        TransitionType.SlideLeft;
      if (
        finalTransitionType &&
        finalTransitionType !== TransitionType.NoTransition
      ) {
        transitionTo(newLocation, finalTransitionType, duration, updateHistory);
      } else {
        updateHistory();
      }
    },
    [currentLocationIndex, history, isTransitioning, options]
  );

  // Low-level state action
  const setLocationState = useCallback(
    (
      index: number,
      state:
        | Record<string, any>
        | ((prev: Record<string, any>) => Record<string, any>)
    ) => {
      setHistory((prevHistory) =>
        prevHistory.map((location) => {
          if (location.index !== index) {
            return location;
          }
          const newState =
            typeof state === "function" ? state(location.state) : state;
          const newLocation = { ...location, state: newState };
          if (index === currentLocationIndex) {
            window.history.replaceState(
              newState,
              "",
              buildUrlFromLocation(newLocation)
            );
          }
          return newLocation;
        })
      );
    },
    [currentLocationIndex]
  );

  const setLocationSearch = useCallback(
    (locationIndex: number, search: Record<string, string>) => {
      setHistory((prev) =>
        prev.map((location) => {
          if (location.index !== locationIndex) return location;
          const newLocation = {
            ...location,
            search: {
              ...location.search,
              ...search,
            },
          };
          if (locationIndex === currentLocationIndex) {
            window.history.replaceState(
              newLocation.state,
              "",
              buildUrlFromLocation(newLocation)
            );
          }
          return newLocation;
        })
      );
    },
    []
  );

  return (
    <RouterContext.Provider
      // oxlint-disable-next-line jsx-no-new-object-as-prop
      value={{
        options,

        history,
        location,
        canGoBack,
        canGoForward,

        isTransitioning,
        transitioningToLocation,
        transitionType,
        transitionDuration,

        buildLocation,

        navigate,
        back,
        forward,

        setLocationState,
        setLocationSearch,
      }}
    >
      <LocationProvider location={location} {...props} />
    </RouterContext.Provider>
  );
};
