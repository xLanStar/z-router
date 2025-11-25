import { useRouter } from "@/hooks/useRouter.js";
import type { NavigateOptions } from "@/types.js";

export type LinkProps = React.ComponentPropsWithoutRef<"a"> & NavigateOptions;

export const Link: React.FC<LinkProps> = ({
  to,
  replace,
  transition,
  duration,
  onFinish,
  ...props
}) => {
  const router = useRouter();
  return (
    <a
      {...props}
      href={to}
      onClick={(e) => {
        e.preventDefault();
        router.navigate({ to, replace, transition, duration, onFinish });
      }}
    />
  );
};
