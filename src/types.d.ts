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
  defaultUseTransition: (
    fromLocation: Location | undefined,
    toLocation: Location | undefined
  ) => boolean;
  /**
   * @default 300
   */
  defaultTransitionDuration: number;
}

export interface TransitionOptions {
  transition?: boolean;
  duration?: number;
  onFinish?: () => void;
}

export type NavigateOptions = {
  to: string;
  replace?: boolean;
} & TransitionOptions;

export type BackOptions = TransitionOptions & {
  depth?: number;
};

export type ForwardOptions = TransitionOptions & {
  depth?: number;
};
