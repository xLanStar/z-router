import { useCallback, useEffect, useState } from "react";

import { RouterContext } from "@/context/router-context.js";
import type {
  BackOptions,
  ForwardOptions,
  Location,
  NavigateOptions,
  RouterOptions,
} from "@/types.js";
import { parseLocation } from "@/utils.js";
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
      // TODO: May can be deleted
      setCurrentLocationIndex(location.index);
      callback?.();
    }, duration);
  };

  // Update location state
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

  const navigate = useCallback(
    ({
      to,
      replace,
      transition,
      duration,
      onFinish,
      ...locationOptions
    }: NavigateOptions) => {
      if (isTransitioning) return;

      const index = replace ? currentLocationIndex : currentLocationIndex + 1;

      // Resolve to with absolute or relative paths like ".." or "."
      // TODO: Wrap into a utility function
      let pathname: string;
      if (to.startsWith("/")) {
        pathname = to;
      } else {
        const currentPathSegments = location.pathname
          .split("/")
          .filter((seg) => seg.length > 0);
        const toPathSegments = to.split("/").filter((seg) => seg.length > 0);
        for (const segment of toPathSegments) {
          if (segment === ".") {
            continue;
          } else if (segment === "..") {
            currentPathSegments.pop();
          } else {
            currentPathSegments.push(segment);
          }
        }
        pathname = "/" + currentPathSegments.join("/");
      }
      const state = {
        index,
      };
      const newLocation = {
        index,
        search: {},
        state,
        pathname,
        ...locationOptions,
      };

      const updateHistory = () => {
        if (replace) {
          setHistory((prevHistory) => [
            ...prevHistory.slice(0, index),
            newLocation,
            ...prevHistory.slice(index + 1),
          ]);
          window.history.replaceState(state, "", pathname);
        } else {
          setHistory((prevHistory) => [
            ...prevHistory.slice(0, index),
            newLocation,
          ]);
          setCurrentLocationIndex(index);
          window.history.pushState(state, "", pathname);
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
    ({ transition, duration, onFinish, depth }: BackOptions = {}) => {
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
    ({ transition, duration, depth, onFinish }: ForwardOptions = {}) => {
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

  return (
    <RouterContext.Provider
      value={{
        options,

        history,
        location,
        canGoBack: currentLocationIndex > 0,
        canGoForward: currentLocationIndex < history.length - 1,

        isTransitioning,
        transitionDuration,
        transitioningToLocation,

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
