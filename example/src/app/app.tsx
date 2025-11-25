import { Stack, type Route } from "@modastar/z-router";
import { MainLayout } from "./_main";
import { HomePage } from "./main/home";
import { SettingsPage } from "./main/settings";

export const rootRoute: Route = {
  beforeLoad: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  pendingComponent: () => <div>Loading...</div>,
  notFoundComponent: () => <div>404 Not Found</div>,
  children: [
    {
      component: MainLayout,
      children: [
        {
          name: "home",
          component: HomePage,
        },
        {
          name: "settings",
          pathname: "settings",
          component: SettingsPage,
        },
      ],
    },
    {
      name: "login",
      pathname: "login",
      component: () => <div>Login Page</div>,
    },
  ],
};

export const App = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Stack rootRoute={rootRoute} />
    </div>
  );
};
