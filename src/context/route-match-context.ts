import { createContext } from "react";
import type { RouteMatch } from "../types.js";

export const RouteMatchContext = createContext<RouteMatch | null>(null);
