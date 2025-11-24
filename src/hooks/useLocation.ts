import { useContext } from "react";

import { LocationContext } from "@/context/locationContext.js";

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === null) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
