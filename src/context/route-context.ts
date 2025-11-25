import type { Route } from "@/types.js";
import { createContext } from "react";

export const RouteContext = createContext<Route | null>(null);
