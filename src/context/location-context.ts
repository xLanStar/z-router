import { createContext } from "react";

import type { Location } from "@/types.js";

export interface LocationContextType extends Location {
  canGoBack: boolean;
  canGoForward: boolean;
  getState: (key: string) => any;
  setState: (key: string, value: any) => void;
  deleteState: (key: string) => void;
}

export const LocationContext = createContext<LocationContextType | null>(null);
