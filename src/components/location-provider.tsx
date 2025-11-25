import { LocationContext } from "@/context/location-context.js";
import type { Location } from "@/types.js";

export const LocationProvider = ({
  location,
  ...props
}: {
  location: Location;
  children: React.ReactNode;
}) => <LocationContext.Provider value={location} {...props} />;
