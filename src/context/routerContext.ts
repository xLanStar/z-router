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
  currentLocationIndex: number;
  location: Location | null;
  canGoBack: boolean;
  canGoForward: boolean;

  // Transition state
  isTransitioning: boolean;
  transitionDuration: number;
  transitioningToIndex: number | null;

  // Actions
  navigate: (options: NavigateOptions) => void;
  back: (options: BackOptions) => void;
  forward: (options: ForwardOptions) => void;
}

export const RouterContext = createContext<RouterContextType | null>(null);
