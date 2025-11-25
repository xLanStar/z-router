import { useCallback, useEffect, useState } from "react";

import { RouterContext } from "@/context/router-context.js";
import type {
  BackOptions,
  ForwardOptions,
  Location,
  NavigateOptions,
  RouterOptions,
} from "@/types.js";
import { DefaultTransitionDuration, parseLocationFromHref } from "@/utils.js";
import { LocationProvider } from "./location-provider.js";

export const RouterProvider = ({
  options,
  ...props
}: {
  options: RouterOptions;
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<Location[]>([
    { index: 0, ...parseLocationFromHref(window.location.href) },
  ]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const location = history.at(currentLocationIndex)!;
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionDuration, setTransitionDuration] = useState<number>(
    DefaultTransitionDuration
  );
  const [transitioningToIndex, setTransitioningToIndex] = useState<number>();

  useEffect(() => {
    window.history.replaceState(
      {
        index: 0,
      },
      ""
    );
  }, []);

  useEffect(() => {
    const handlePopState = ({ state }: PopStateEvent) => {
      setCurrentLocationIndex(state?.index ?? 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [history]);

  const navigate = useCallback(
    ({
      to,
      replace,
      transition,
      duration,
      updateHistory = true,
      onFinish,
      ...locationOptions
    }: NavigateOptions) => {
      if (isTransitioning) return;

      const index = replace ? currentLocationIndex : currentLocationIndex + 1;

      // Resolve to with absolute or relative paths like ".." or "."
      let pathname: string;
      if (to.startsWith(".")) {
        const currentPathSegments = location.pathname
          .split("/")
          .filter((seg) => seg.length > 0);
        const toPathSegments = to.split("/").filter((seg) => seg.length > 0);
        for (const segment of toPathSegments) {
          if (segment.startsWith(".")) {
            if (segment === ".") {
              continue;
            } else if (segment === "..") {
              currentPathSegments.pop();
            } else {
              throw new Error(
                `Invalid relative path segment: ${segment} in ${to}`
              );
            }
          } else if (segment.length > 0) {
            currentPathSegments.push(segment);
          }
        }
        pathname = "/" + currentPathSegments.join("/");
      } else {
        pathname = to;
      }

      const newLocation: Location = {
        index,
        search: {},
        state: new Map(),
        pathname,
        ...locationOptions,
      };
      if (index === history.length) {
        setHistory([...history, newLocation]);
      } else {
        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[index] = newLocation;
          return newHistory.slice(0, currentLocationIndex + 2);
        });
      }
      if (
        !replace &&
        currentLocationIndex >= 0 &&
        (transition ??
          options.defaultUseTransition?.(
            history.at(currentLocationIndex),
            history.at(index)
          ))
      ) {
        const currentDuration = duration ?? DefaultTransitionDuration;
        setIsTransitioning(true);
        setTransitionDuration(currentDuration);
        setTransitioningToIndex(index);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitioningToIndex(undefined);
          setCurrentLocationIndex(index);
          onFinish?.();
          if (updateHistory) {
            window.history.pushState(
              {
                index,
              },
              "",
              to
            );
          }
        }, currentDuration);
      } else if (!replace) {
        setCurrentLocationIndex(index);
        if (updateHistory) {
          window.history.pushState(
            {
              index,
            },
            "",
            to
          );
        }
      } else if (updateHistory) {
        window.history.replaceState(
          {
            index,
          },
          "",
          to
        );
      }
    },
    [currentLocationIndex, history, isTransitioning, options]
  );

  const back = useCallback(
    ({ transition, duration, onFinish, depth }: BackOptions = {}) => {
      if (currentLocationIndex === 0 || isTransitioning) return;
      const newLocationIndex = currentLocationIndex - (depth ?? 1);
      if (
        currentLocationIndex > 0 &&
        (transition ??
          options.defaultUseTransition?.(
            history.at(currentLocationIndex),
            history.at(newLocationIndex)
          ))
      ) {
        const finalDuration = duration ?? DefaultTransitionDuration;
        setIsTransitioning(true);
        setTransitionDuration(finalDuration);
        setTransitioningToIndex(newLocationIndex);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitioningToIndex(undefined);
          setCurrentLocationIndex(newLocationIndex);
          onFinish?.();
          window.history.back();
        }, finalDuration);
      } else {
        setCurrentLocationIndex(newLocationIndex);
        onFinish?.();
        window.history.back();
      }
    },
    [currentLocationIndex, history, isTransitioning, options]
  );

  const forward = useCallback(
    ({ transition, duration, onFinish }: ForwardOptions = {}) => {
      if (currentLocationIndex + 1 >= history.length || isTransitioning) return;
      const newLocationIndex = currentLocationIndex + 1;
      if (
        newLocationIndex < history.length &&
        (transition ??
          options.defaultUseTransition?.(
            history.at(currentLocationIndex),
            history.at(newLocationIndex)
          ))
      ) {
        const finalDuration = duration ?? DefaultTransitionDuration;
        setIsTransitioning(true);
        setTransitionDuration(finalDuration);
        setTransitioningToIndex(newLocationIndex);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitioningToIndex(undefined);
          setCurrentLocationIndex(newLocationIndex);
          onFinish?.();
          window.history.forward();
        }, finalDuration);
      } else {
        setCurrentLocationIndex(newLocationIndex);
        onFinish?.();
        window.history.forward();
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
        transitioningToIndex,

        navigate,
        back,
        forward,
      }}
    >
      <LocationProvider location={location} {...props} />
    </RouterContext.Provider>
  );
};
