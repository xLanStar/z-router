import { createContext } from "react";

import type {
  BackActionOptions,
  ForwardActionOptions,
  Location,
  NavigateActionOptions,
  NavigationOptions,
  RouterOptions,
  TransitionType,
} from "@/types.js";

export interface RouterContextType {
  // Router Config
  options: RouterOptions;

  // Navigation State
  history: Location[];
  location: Location;
  canGoBack: boolean;
  canGoForward: boolean;

  // Transition state
  isTransitioning: boolean;
  transitioningToLocation?: Location;
  transitionType?: TransitionType;
  transitionDuration: number;

  // Utilities
  buildLocation: (to: NavigationOptions) => Location;

  // Navigation Actions
  navigate: (options: NavigateActionOptions) => void;
  back: (options?: BackActionOptions) => void;
  forward: (options?: ForwardActionOptions) => void;

  // Low-level state action
  setLocationState: (
    index: number,
    state:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>)
  ) => void;
  setLocationSearch: (
    locationIndex: number,
    search: Record<string, string>
  ) => void;
}

export const RouterContext = createContext<RouterContextType | null>(null);
