import { createContext } from "react";

import type {
  BackOptions,
  ForwardOptions,
  Location,
  NavigateOptions,
  RouterOptions,
} from "@/types.js";

export interface RouterContextType {
  // Router Config
  options: RouterOptions;

  // Navigation State
  history: Location[];
  location?: Location;
  canGoBack: boolean;
  canGoForward: boolean;

  // Transition state
  isTransitioning: boolean;
  transitionDuration: number;
  transitioningToIndex?: number;

  // Actions
  navigate: (options: NavigateOptions) => void;
  back: (options?: BackOptions) => void;
  forward: (options?: ForwardOptions) => void;

  // Low-level state action
  setLocationState: (index: number, state: Record<string, any>) => void;
}

export const RouterContext = createContext<RouterContextType | null>(null);
