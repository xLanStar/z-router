import { createContext } from "react";

import type { Location } from "../types.js";

export interface LocationContextType extends Location {
  canGoBack: boolean;
  canGoForward: boolean;
  state: Record<string, any>;
  setState: (key: string, value: any) => void;
  deleteState: (key: string) => void;
  setSearch: (key: string, value: string) => void;
}

export const LocationContext = createContext<LocationContextType | null>(null);
