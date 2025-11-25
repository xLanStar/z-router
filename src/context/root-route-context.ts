import { createContext } from "react";

import type { ParsedRoute } from "@/types.js";

export interface RootRouteContextType extends ParsedRoute {
  getRouteState: (id: string, key: string) => any;
  setRouteState: (id: string, key: string, value: any) => void;
}

export const RootRouteContext = createContext<RootRouteContextType | null>(
  null
);
