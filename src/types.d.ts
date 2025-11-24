import type { Pathname } from "@/lib/router";

export interface Route {
  id?: string;
  pathname?: string;
  beforeLoad?: ({ location }: { location: Location }) => Promise<void>;
  component?: React.ComponentType<{ children?: React.ReactNode }>;
  pendingComponent?: React.ComponentType;
  children?: Route[];
}

export interface RootRoute extends Route {
  notFoundComponent?: React.ComponentType;
}

export interface Location {
  index: number;
  pathname: Pathname;
  params: any;
  query: any;
  state?: Map<string, any>;
}

export interface RouterOptions {
  defaultViewTransition?: (
    fromLocation: Location | undefined,
    toLocation: Location | undefined
  ) => boolean;
}

export interface TransitionOptions {
  transition?: boolean;
  duration?: number;
  onFinish?: () => void;
}

export type NavigateOptions = Partial<
  Pick<Location, "params" | "query" | "state">
> & {
  to: string;
  replace?: boolean;
  updateHistory?: boolean;
} & TransitionOptions;

export type BackOptions =
  | (TransitionOptions & {
      depth?: number;
    })
  | void;

export type ForwardOptions =
  | (TransitionOptions & {
      depth?: number;
    })
  | void;

export class RedirectError extends Error {
  options: { to: string; replace?: boolean };
  constructor(options: { to: string; replace?: boolean }) {
    super();
    this.options = options;
  }
}
