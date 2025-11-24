import { useContext } from "react";

import { RouterContext } from "@/context/routerContext.js";

export const useRouter = () => {
  const router = useContext(RouterContext);
  if (router === null) {
    throw new Error("useRouter must be used within a Stack");
  }
  return router;
};
