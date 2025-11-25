import type { RouteMatch } from "@/types.js";
import { createContext } from "react";

export const RouteMatchContext = createContext<RouteMatch | null>(null);
