import type { TransitionType } from "./constants.ts";

export interface Route {
  name?: string;
  pathname?: string;
  beforeLoad?: ({ location }: { location: Location }) => Promise<void>;
  pendingComponent?: React.ComponentType;
  component?: React.ComponentType<{ children?: React.ReactNode }>;
  notFoundComponent?: React.ComponentType;
  children?: Route[];
}

export interface ParsedRoute extends Route {
  id: string;
  children?: ParsedRoute[];
}

export interface Location {
  index: number;
  href: string;
  pathname: string;
  search: Record<string, string>;
  state: Record<string, any>;
}

export interface RouteMatch {
  matches: ParsedRoute[];
  params: Record<string, string>;
  query: Record<string, string>;
}

export interface RouterOptions {
  defaultTransitionType?: (
    fromLocation: Location,
    toLocation: Location
  ) => TransitionType;
  /**
   * @default 300
   */
  defaultTransitionDuration: number;
}

export type TransitionType = "slide-left" | "slide-right" | "none" | undefined;

export interface TransitionOptions {
  transitionType?: TransitionType;
  duration?: number;
  onFinish?: () => void;
}

export interface NavigationOptions {
  to: string;
  replace?: boolean;
}

export interface HistoryTraversalOptions {
  depth?: number;
}

export type NavigateActionOptions = TransitionOptions & NavigationOptions;
export type BackActionOptions = TransitionOptions & HistoryTraversalOptions;
export type ForwardActionOptions = TransitionOptions & HistoryTraversalOptions;
