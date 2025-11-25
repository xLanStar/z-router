import { createContext } from "react";

import type { Route } from "@/types.js";

export const RootRouteContext = createContext<Route | null>(null);
