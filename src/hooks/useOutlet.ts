import { OutletContext } from "@/context/outlet-context.js";
import { useContext } from "react";

export const useOutlet = () => {
  const outlet = useContext(OutletContext);
  if (outlet === null) {
    throw new Error("useOutlet must be used within an OutletProvider");
  }
  return outlet;
};
