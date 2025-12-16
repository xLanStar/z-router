import { useContext } from "react";

import { LocationContext } from "../context/location-context.js";

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === null) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
