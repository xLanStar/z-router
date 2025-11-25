import { createContext } from "react";

import type { Location } from "@/types.js";

export const LocationContext = createContext<Location | null>(null);
