import { useContext } from "react";
import { OutletContext } from "../context/outlet-context.js";

export const useOutlet = () => useContext(OutletContext);
