import { useCallback, useEffect, useState } from "react";

import { RouterContext } from "@/context/router-context.js";
import type {
  BackActionOptions,
  ForwardActionOptions,
  Location,
  NavigateActionOptions,
  NavigationOptions,
  RouterOptions,
} from "@/types.js";
import { parseLocation, resolveRelativePathname } from "@/utils.js";
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
  const location = history.at(currentLocationIndex)!;
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionDuration, setTransitionDuration] = useState<number>(0);
  const [transitioningToLocation, setTransitioningToLocation] =
    useState<Location>();

  useEffect(() => {
    window.history.replaceState(location.state, "", location.pathname);
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
  const buildLocation = ({ to, replace }: NavigationOptions): Location => {
    const index = replace ? currentLocationIndex : currentLocationIndex + 1;

    // Resolve to with absolute or relative paths like ".." or "."
    const pathname = to.startsWith("/")
      ? to
      : resolveRelativePathname(location.pathname, to);
    const state = {
      index,
    };
    return {
      index,
      search: {},
      state,
      pathname,
    };
  };

  // Transition helper
  const transitionTo = (
    location: Location,
    duration: number = options.defaultTransitionDuration,
    callback?: () => void
  ) => {
    setIsTransitioning(true);
    setTransitionDuration(duration);
    setTransitioningToLocation(location);
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitioningToLocation(undefined);
      callback?.();
    }, duration);
  };

  // Navigation actions
  const navigate = useCallback(
    ({
      to,
      replace,
      transition,
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
            newLocation.pathname
          );
        } else {
          setHistory((prevHistory) => [
            ...prevHistory.slice(0, index),
            newLocation,
          ]);
          setCurrentLocationIndex(index);
          window.history.pushState(newLocation.state, "", newLocation.pathname);
        }
        onFinish?.();
      };

      if (transition ?? options.defaultUseTransition?.(location, newLocation)) {
        transitionTo(newLocation, duration, updateHistory);
      } else {
        updateHistory();
      }
    },
    [currentLocationIndex, history, isTransitioning, options]
  );

  const back = useCallback(
    ({ transition, duration, onFinish, depth }: BackActionOptions = {}) => {
      if (currentLocationIndex === 0 || isTransitioning) return;
      const backDepth = depth ?? 1;
      const newLocation = history.at(currentLocationIndex - backDepth);

      const updateHistory = () => {
        window.history.go(-backDepth);
        onFinish?.();
      };

      if (
        newLocation &&
        (transition ?? options.defaultUseTransition?.(location, newLocation))
      ) {
        transitionTo(newLocation, duration, updateHistory);
      } else {
        updateHistory();
      }
    },
    [currentLocationIndex, history, isTransitioning, options]
  );

  const forward = useCallback(
    ({ transition, duration, depth, onFinish }: ForwardActionOptions = {}) => {
      if (currentLocationIndex + 1 >= history.length || isTransitioning) return;
      const forwardDepth = depth ?? 1;
      const newLocation = history.at(currentLocationIndex + forwardDepth);

      const updateHistory = () => {
        window.history.go(forwardDepth);
        onFinish?.();
      };

      if (
        newLocation &&
        (transition ?? options.defaultUseTransition?.(location, newLocation))
      ) {
        transitionTo(newLocation, duration, updateHistory);
      } else {
        updateHistory();
      }
    },
    [currentLocationIndex, history, isTransitioning, options]
  );

  // Low-level state action
  const setLocationState = useCallback(
    (index: number, state: Record<string, any>) => {
      setHistory((prevHistory) =>
        prevHistory.map((location) =>
          location.index === index ? { ...location, state } : location
        )
      );
      if (index === currentLocationIndex) {
        window.history.replaceState(state, "", location.pathname);
      }
    },
    [currentLocationIndex]
  );

  return (
    <RouterContext.Provider
      // oxlint-disable-next-line jsx-no-new-object-as-prop
      value={{
        options,

        history,
        location,
        canGoBack: currentLocationIndex > 0,
        canGoForward: currentLocationIndex < history.length - 1,

        isTransitioning,
        transitionDuration,
        transitioningToLocation,

        buildLocation,

        navigate,
        back,
        forward,

        setLocationState,
      }}
    >
      <LocationProvider location={location} {...props} />
    </RouterContext.Provider>
  );
};
