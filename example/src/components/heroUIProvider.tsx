import { HeroUIProvider as HeroUIProviderComponent } from "@heroui/system";
import { useRouter } from "@modastar/z-router";

export const HeroUIProvider = (props: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <HeroUIProviderComponent
      navigate={(to: any, options: any) => router.navigate({ to, ...options })}
      useHref={(to) => router.buildLocation({ to }).href}
      {...props}
    />
  );
};
