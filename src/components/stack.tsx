import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "@/hooks/useRouter.js";
import type { Route } from "@/types.js";

import { LocationProvider } from "./location-provider.js";
import { PageRenderer } from "./page-renderer.js";
import { RootRouteProvider } from "./root-route-provider.js";

type StackComponentProps = React.ComponentPropsWithoutRef<"div">;

const StackComponent: React.FC<StackComponentProps> = ({ style, ...props }) => {
  const {
    history,
    location,
    canGoBack,
    canGoForward,
    isTransitioning,
    transitioningToLocation,
    transitionType,
    transitionDuration,
    back,
    forward,
  } = useRouter();
  const currentLocationIndex = location.index;

  const isTouching = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [draggedLeft, setDraggedLeft] = useState(false);
  const [draggedRight, setDraggedRight] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isTransitionStarted, setIsTransitionStarted] = useState(false);

  useEffect(() => {
    if (!isTransitioning || !transitioningToLocation) return;
    setIsTransitionStarted(true);
    setTimeout(() => {
      setIsTransitionStarted(false);
    }, transitionDuration);
  }, [isTransitioning, transitioningToLocation, transitionDuration]);

  if (currentLocationIndex === undefined) return;

  const reset = () => {
    setIsDragging(false);
    setDragOffset(0);
    setDraggedLeft(false);
    setDraggedRight(false);
    setIsCanceling(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning || (!canGoForward && !canGoBack)) return;
    isTouching.current = true;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching.current) return;
    // Skip vertical drag
    const { clientX, clientY } = e.touches[0];
    if (!isDragging && Math.abs(clientY - startY.current) > 30) {
      isTouching.current = false;
      return;
    }
    const offset = clientX - startX.current;
    if (Math.abs(offset) < 10) return;
    if (!isDragging) {
      setIsDragging(true);
    }
    if (
      (offset > 0 && currentLocationIndex === 0) ||
      (offset < 0 && currentLocationIndex + 1 === history.length)
    ) {
      setDragOffset(0);
      return;
    }
    if (!draggedLeft && offset < 0) setDraggedLeft(true);
    if (!draggedRight && offset > 0) setDraggedRight(true);
    setDragOffset(
      Math.max(Math.min(offset, window.innerWidth), -window.innerWidth)
    );
  };

  const handleTouchEnd = useCallback(() => {
    isTouching.current = false;
    if (!isDragging) return;

    const options = {
      onFinish: reset,
    };
    if (dragOffset > innerWidth * 0.3 && canGoBack) {
      back(options);
    } else if (dragOffset < -innerWidth * 0.3 && canGoForward) {
      forward(options);
    } else {
      setIsCanceling(true);
      setTimeout(reset, transitionDuration);
    }
  }, [
    back,
    forward,
    isDragging,
    dragOffset,
    canGoBack,
    canGoForward,
    transitionDuration,
  ]);

  console.log(
    "Stack",
    currentLocationIndex >= 1 &&
      ((isDragging && draggedRight) ||
        (isTransitioning && transitionType === "slide-right")),
    (isDragging && draggedLeft) ||
      (isTransitioning && transitionType === "slide-left")
  );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      {((isTransitioning && transitionType === "slide-right") ||
        (isDragging && draggedRight)) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
          }}
        >
          <LocationProvider
            location={
              isTransitioning
                ? transitioningToLocation!
                : history.at(currentLocationIndex - 1)!
            }
          >
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
          transform:
            isTransitioning && transitionType === "slide-right"
              ? `translateX(100%)`
              : isDragging && dragOffset > 0 && !isCanceling
              ? `translateX(${dragOffset}px)`
              : "translateX(0px)",
          transition:
            isCanceling || (isTransitioning && transitionType === "slide-right")
              ? `transform ${transitionDuration}ms ease-out`
              : "",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <PageRenderer />
      </div>
      {((isTransitioning && transitionType === "slide-left") ||
        (isDragging && draggedLeft)) && (
        <div
          style={{
            background: "white",
            position: "absolute",
            inset: 0,
            zIndex: 1,
            transform: `translateX(${
              isTransitionStarted
                ? "0px"
                : isTransitioning || isCanceling
                ? "100%"
                : `${innerWidth + dragOffset}px`
            })`,
            transition: `transform ${
              isTransitioning || isCanceling ? transitionDuration : 0
            }ms ease-in`,
          }}
        >
          <LocationProvider
            location={
              isTransitioning
                ? transitioningToLocation!
                : history.at(currentLocationIndex + 1)!
            }
          >
            <PageRenderer key={transitioningToLocation?.index} />
          </LocationProvider>
        </div>
      )}
    </div>
  );
};

export interface StackProps extends StackComponentProps {
  route: Route;
}

export const Stack: React.FC<StackProps> = ({ route, ...props }) => (
  <RootRouteProvider route={route}>
    <StackComponent {...props} />
  </RootRouteProvider>
);
