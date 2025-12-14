import { useRouter } from "@modastar/z-router";
import { useEffect } from "react";

export const NotFoundPage = () => {
  const router = useRouter();
  console.log("NotFoundPage Rendered");
  useEffect(() => {
    router.navigate({ to: "/home", replace: true });
  }, []);
  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  );
};
