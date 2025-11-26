import { useRouter } from "@/hooks/useRouter.js";
import type { NavigateOptions } from "@/types.js";
import { memo } from "react";

export type LinkProps = React.ComponentPropsWithoutRef<"a"> & NavigateOptions;

export const Link: React.FC<LinkProps> = memo((props) => {
  const router = useRouter();
  return (
    <a
      href={props.to}
      onClick={(e) => {
        e.preventDefault();
        router.navigate(props);
      }}
      {...props}
    />
  );
});
