import { useCallback, useEffect, useState } from "react";

import { RouterContext } from "@/context/routerContext.js";
import type {
  BackOptions,
  ForwardOptions,
  Location,
  NavigateOptions,
  RouterOptions,
} from "@/types.js";
import { DefaultTransitionDuration } from "@/utils.js";

export const RouterProvider = ({
  router,
  children,
}: {
  router: RouterOptions;
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<Location[]>([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(-1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionDuration, setTransitionDuration] = useState<number>(
    DefaultTransitionDuration
  );
  const [transitioningToIndex, setTransitioningToIndex] = useState<
    number | null
  >(null);

  const navigate = useCallback(
    ({
      to,
      replace,
      transition,
      duration,
      updateHistory,
      onFinish,
      ...locationOptions
    }: NavigateOptions) => {
      if (isTransitioning) return;
      const newLocationIndex = replace
        ? currentLocationIndex
        : currentLocationIndex + 1;
      const newLocation: Location = {
        index: newLocationIndex,
        params: {},
        query: {},
        state: new Map(),
        pathname: to,
        ...locationOptions,
      };
      if (newLocationIndex === history.length) {
        setHistory([...history, newLocation]);
      } else {
        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[newLocationIndex] = newLocation;
          return newHistory.slice(0, currentLocationIndex + 2);
        });
      }
      if (
        !replace &&
        currentLocationIndex >= 0 &&
        (transition ??
          router.defaultViewTransition?.(
            history.at(currentLocationIndex),
            history.at(newLocationIndex)
          ))
      ) {
        const currentDuration = duration ?? DefaultTransitionDuration;
        setIsTransitioning(true);
        setTransitionDuration(currentDuration);
        setTransitioningToIndex(newLocationIndex);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitioningToIndex(null);
          setCurrentLocationIndex(newLocationIndex);
          onFinish?.();
          if (updateHistory) {
            window.history.pushState({}, "", to);
          }
        }, currentDuration);
      } else if (!replace) {
        setCurrentLocationIndex(newLocationIndex);
        if (updateHistory) {
          window.history.pushState({}, "", to);
        }
      } else if (updateHistory) {
        window.history.replaceState({}, "", to);
      }
    },
    [currentLocationIndex, history, isTransitioning, router]
  );

  useEffect(() => {
    console.log("Navigate: History updated:", history);
  }, [history]);

  const back = useCallback(
    (options: BackOptions) => {
      if (isTransitioning) return;
      const newLocationIndex = currentLocationIndex - (options?.depth ?? 1);
      if (
        currentLocationIndex > 0 &&
        (options?.transition ??
          router.defaultViewTransition?.(
            history.at(currentLocationIndex),
            history.at(newLocationIndex)
          ))
      ) {
        const currentDuration = options?.duration ?? DefaultTransitionDuration;
        setIsTransitioning(true);
        setTransitionDuration(currentDuration);
        setTransitioningToIndex(newLocationIndex);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitioningToIndex(null);
          setCurrentLocationIndex(newLocationIndex);
          options?.onFinish?.();
        }, currentDuration);
      } else {
        setCurrentLocationIndex(newLocationIndex);
      }
    },
    [currentLocationIndex, history, isTransitioning, router]
  );

  const forward = useCallback(
    (options: ForwardOptions) => {
      if (isTransitioning) return;
      const newLocationIndex = currentLocationIndex + 1;
      if (
        newLocationIndex < history.length &&
        (options?.transition ??
          router.defaultViewTransition?.(
            history.at(currentLocationIndex),
            history.at(newLocationIndex)
          ))
      ) {
        const duration = options?.duration ?? DefaultTransitionDuration;
        setIsTransitioning(true);
        setTransitionDuration(duration);
        setTransitioningToIndex(newLocationIndex);
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitioningToIndex(null);
          setCurrentLocationIndex(newLocationIndex);
          options?.onFinish?.();
        }, duration);
      } else {
        setCurrentLocationIndex(newLocationIndex);
      }
    },
    [currentLocationIndex, history, isTransitioning, router]
  );

  return (
    <RouterContext.Provider
      value={{
        options: router,

        history,
        currentLocationIndex,
        location: history.at(currentLocationIndex) || null,
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
      {children}
    </RouterContext.Provider>
  );
};
