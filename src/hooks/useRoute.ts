import { RouteContext } from "@/context/route-context.js";
import { useContext } from "react";

export const useRoute = () => useContext(RouteContext);
