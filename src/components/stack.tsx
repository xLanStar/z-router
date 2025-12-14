import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "@/hooks/useRouter.js";
import type { Route } from "@/types.js";

import { LocationProvider } from "./location-provider.js";
import { PageRenderer } from "./page-renderer.js";
import { RootRouteProvider } from "./root-route-provider.js";

const PreviousComponentStyle = {
  position: "absolute",
  inset: 0,
  zIndex: -1,
} as const;

export interface StackComponentProps
  extends React.ComponentPropsWithoutRef<"div"> {
  allowSwipeForward?: boolean;
  allowSwipeBack?: boolean;
}

const StackComponent: React.FC<StackComponentProps> = ({
  allowSwipeBack = true,
  allowSwipeForward = true,
  style,
  ...props
}) => {
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
  const [showPreviousComponent, setShowPreviousComponent] = useState(false);
  const [showNextComponent, setShowNextComponent] = useState(false);
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
    setShowPreviousComponent(false);
    setShowNextComponent(false);
    setIsCanceling(false);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isTransitioning || (!canGoForward && !canGoBack)) return;
      isTouching.current = true;
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    },
    [isTransitioning, canGoBack, canGoForward]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
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
      if (!showPreviousComponent && offset < 0 && allowSwipeForward)
        setShowPreviousComponent(true);
      if (!showNextComponent && offset > 0 && allowSwipeBack)
        setShowNextComponent(true);
      setDragOffset(
        Math.max(Math.min(offset, window.innerWidth), -window.innerWidth)
      );
    },
    [
      isDragging,
      currentLocationIndex,
      history.length,
      showPreviousComponent,
      showNextComponent,
      allowSwipeBack,
      allowSwipeForward,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    isTouching.current = false;
    if (!isDragging) return;

    const options = {
      onFinish: reset,
    };
    if (dragOffset > innerWidth * 0.3 && canGoBack && allowSwipeBack) {
      back(options);
    } else if (
      dragOffset < -innerWidth * 0.3 &&
      canGoForward &&
      allowSwipeForward
    ) {
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
        (isDragging && showNextComponent)) && (
        <div style={PreviousComponentStyle}>
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
        (isDragging && showPreviousComponent)) && (
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
