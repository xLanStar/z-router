import { memo } from "react";
import { useRouter } from "../hooks/useRouter.js";
import type { NavigateActionOptions } from "../types.js";

export type LinkProps = React.ComponentPropsWithoutRef<"a"> &
  NavigateActionOptions;

export const Link: React.FC<LinkProps> = memo(
  ({ to, replace, transitionType, duration, onFinish, ...props }) => {
    const router = useRouter();
    return (
      <a
        {...props}
        href={to}
        onClick={(e) => {
          e.preventDefault();
          router.navigate({
            to,
            replace,
            transitionType,
            duration,
            onFinish,
          });
        }}
      />
    );
  }
);
