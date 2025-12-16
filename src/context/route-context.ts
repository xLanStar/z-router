import type { ParsedRoute } from "@/types.js";
import { createContext } from "react";

export interface RouteContextType extends ParsedRoute {
  state: Record<string, any>;
  getState: (key: string) => any;
  setState: (key: string, value: any) => void;
}

export const RouteContext = createContext<RouteContextType | null>(null);
