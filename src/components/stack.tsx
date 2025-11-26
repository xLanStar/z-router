import { useEffect, useState } from "react";

import { useRouter } from "@/hooks/useRouter.js";
import type { Route } from "@/types.js";

import { LocationProvider } from "./location-provider.js";
import { PageRenderer } from "./page-renderer.js";
import { RootRouteProvider } from "./root-route-provider.js";

const StackComponent = () => {
  const {
    history,
    location,
    canGoBack,
    canGoForward,
    isTransitioning,
    transitioningToLocation,
    transitionDuration,
    back,
    forward,
  } = useRouter();
  const currentLocationIndex = location?.index;
  const transitioningToLocationIndex = transitioningToLocation?.index;

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isTransitionStarted, setIsTransitionStarted] = useState(false);

  useEffect(() => {
    if (!isTransitioning || !transitioningToLocation) return;
    setIsTransitionStarted(true);
    setTimeout(() => {
      setIsTransitionStarted(false);
    }, transitionDuration);
  }, [isTransitioning, transitioningToLocation]);

  if (currentLocationIndex === undefined) return;

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
    setDragOffset(Math.min(innerWidth, offset));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    if (dragOffset > innerWidth * 0.3 && canGoBack) {
      back({
        onFinish: reset,
      });
    } else if (dragOffset < -innerWidth * 0.3 && canGoForward) {
      forward({
        onFinish: reset,
      });
    } else {
      setIsCanceling(true);
      setTimeout(reset, transitionDuration);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        inset: 0,
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {currentLocationIndex >= 1 &&
        ((isDragging && dragOffset > 0) ||
          (isTransitioning &&
            transitioningToLocation &&
            transitioningToLocation.index < currentLocationIndex)) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: -10,
            }}
          >
            <LocationProvider location={history.at(currentLocationIndex - 1)!}>
              <PageRenderer key={currentLocationIndex - 1} />
            </LocationProvider>
          </div>
        )}
      <div
        key={currentLocationIndex}
        style={{
          background: "white",
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          transform:
            isTransitioning &&
            transitioningToLocation &&
            transitioningToLocation.index < currentLocationIndex
              ? `translateX(100%)`
              : isDragging && dragOffset > 0 && !isCanceling
              ? `translateX(${dragOffset}px)`
              : "translateX(0px)",
          transition:
            isCanceling ||
            (isTransitioning &&
              transitioningToLocation &&
              transitioningToLocation.index < currentLocationIndex)
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
        <PageRenderer />
      </div>
      {((isDragging && dragOffset < 0) ||
        (isTransitioning &&
          transitioningToLocation &&
          currentLocationIndex <= transitioningToLocation.index)) && (
        <div
          style={{
            background: "white",
            position: "absolute",
            inset: 0,
            zIndex: 10,
            overflow: "hidden",
            transition: "transform ease-in",
            transform: isTransitionStarted
              ? `translateX(0px)`
              : isTransitioning
              ? "translateX(100%)"
              : `translateX(${innerWidth + dragOffset}px)`,
            transitionDuration:
              isTransitioning || isCanceling
                ? `${transitionDuration}ms`
                : "0ms",
          }}
        >
          <LocationProvider
            location={
              isTransitioning
                ? transitioningToLocation!
                : history.at(currentLocationIndex + 1)!
            }
          >
            <PageRenderer key={transitioningToLocationIndex} />
          </LocationProvider>
        </div>
      )}
    </div>
  );
};

export const Stack = ({ rootRoute }: { rootRoute: Route }) => (
  <RootRouteProvider rootRoute={rootRoute}>
    <StackComponent />
  </RootRouteProvider>
);
