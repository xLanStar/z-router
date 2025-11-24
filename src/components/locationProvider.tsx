import { LocationContext } from "@/context/locationContext.js";
import type { Location } from "@/types.js";

export const LocationProvider = ({
  location,
  children,
}: {
  location: Location;
  children: React.ReactNode;
}) => {
  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};
