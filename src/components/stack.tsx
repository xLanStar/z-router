import { useEffect, useState } from "react";

import { useMatches } from "@/hooks/useMatches.js";
import { useRoute } from "@/hooks/useRoute.js";
import { useRouter } from "@/hooks/useRouter.js";
import type { RootRoute } from "@/types.js";

import { LocationProvider } from "./locationProvider.js";
import { RouteComponent } from "./routeComponent.js";
import { RouteProvider } from "./routeProvider.js";

export const PageRenderer = () => {
  const route = useRoute();
  const matches = useMatches();
  if (!matches || matches.length === 0) {
    const NotFoundComponent = route.notFoundComponent!;
    return <NotFoundComponent />;
  }
  let content: React.ReactNode = null;
  for (let i = matches.length - 1; i >= 0; i--) {
    const route = matches[i];
    content = <RouteComponent route={route}>{content}</RouteComponent>;
  }
  return content;
};

const StackComponent = () => {
  const {
    history,
    currentLocationIndex,
    canGoBack,
    canGoForward,
    isTransitioning,
    transitioningToIndex,
    transitionDuration,
    back,
    forward,
  } = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isTransitionStarted, setIsTransitionStarted] = useState(false);

  useEffect(() => {
    if (!isTransitioning || transitioningToIndex === null) return;
    setIsTransitionStarted(true);
    setTimeout(() => {
      setIsTransitionStarted(false);
    }, transitionDuration);
  }, [isTransitioning, transitioningToIndex]);

  const reset = () => {
    setIsDragging(false);
    setDragOffset(0);
    setIsCanceling(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning || (!canGoForward && !canGoBack)) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const offset = e.touches[0].clientX - startX;
    if (
      (offset > 0 && currentLocationIndex === 0) ||
      (offset < 0 && currentLocationIndex + 1 === history.length)
    ) {
      setDragOffset(0);
      return;
    }
    setDragOffset(Math.min(window.innerWidth, offset));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    if (dragOffset > window.innerWidth * 0.3 && canGoBack) {
      back({
        onFinish: reset,
      });
    } else if (dragOffset < -window.innerWidth * 0.3 && canGoForward) {
      forward({
        onFinish: reset,
      });
    } else {
      setIsCanceling(true);
      setTimeout(reset, transitionDuration);
    }
  };

  return (
    <div className="relative inset-0 h-full w-full overflow-hidden">
      {currentLocationIndex >= 1 && (
        <div className="absolute inset-0 -z-10">
          <LocationProvider location={history.at(currentLocationIndex - 1)!}>
            <PageRenderer key={currentLocationIndex - 1} />
          </LocationProvider>
        </div>
      )}
      <div
        key={currentLocationIndex}
        className="bg-background absolute inset-0 overflow-hidden"
        style={{
          transform:
            isTransitioning &&
            transitioningToIndex !== null &&
            transitioningToIndex < currentLocationIndex
              ? `translateX(100%)`
              : isDragging && dragOffset > 0 && !isCanceling
              ? `translateX(${dragOffset}px)`
              : "translateX(0px)",
          transition:
            isCanceling ||
            (isTransitioning &&
              transitioningToIndex !== null &&
              transitioningToIndex < currentLocationIndex)
              ? `transform ${transitionDuration}ms ease-out`
              : "",
          boxShadow:
            isDragging && dragOffset > 0
              ? "-4px 0 8px rgba(0,0,0,0.1)"
              : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <LocationProvider location={history.at(currentLocationIndex)!}>
          <PageRenderer key={currentLocationIndex} />
        </LocationProvider>
      </div>
      {((isDragging && dragOffset < 0) ||
        (isTransitioning &&
          transitioningToIndex !== null &&
          currentLocationIndex < transitioningToIndex)) && (
        <div
          key={transitioningToIndex}
          className="bg-background absolute inset-0 z-10 overflow-hidden transition-transform ease-in"
          style={{
            transform: isTransitionStarted
              ? `translateX(0px)`
              : isDragging && !isCanceling
              ? `translateX(${window.innerWidth + dragOffset}px)`
              : "translateX(100%)",
            transitionDuration:
              isTransitioning || isCanceling
                ? `${transitionDuration}ms`
                : "0ms",
          }}
        >
          <LocationProvider
            location={
              isDragging
                ? history.at(currentLocationIndex + 1)!
                : history.at(transitioningToIndex!)!
            }
          >
            <PageRenderer key={transitioningToIndex} />
          </LocationProvider>
        </div>
      )}
    </div>
  );
};

export const Stack = ({ rootRoute }: { rootRoute: RootRoute }) => {
  return (
    <RouteProvider rootRoute={rootRoute}>
      <StackComponent />
    </RouteProvider>
  );
};
