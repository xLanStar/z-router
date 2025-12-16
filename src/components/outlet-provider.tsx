import { OutletContext } from "../context/outlet-context.js";

export const OutletProvider = ({
  depth,
  ...props
}: {
  depth: number;
  children?: React.ReactNode;
}) => <OutletContext.Provider value={depth} {...props} />;
