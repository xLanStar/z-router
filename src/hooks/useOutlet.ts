import { OutletContext } from "@/context/outlet-context.js";
import { useContext } from "react";

export const useOutlet = () => useContext(OutletContext);
