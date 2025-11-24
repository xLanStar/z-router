import { createContext } from "react";

import type { RootRoute } from "@/types.js";

export const RouteContext = createContext<RootRoute | null>(null);
