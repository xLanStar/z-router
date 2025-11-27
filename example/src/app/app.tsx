import { Stack, type Route } from "@modastar/z-router";
import { MainLayout } from "./_main";
import { RootLayout } from "./_root";
import { HomePage } from "./main/home";
import { SettingsPage } from "./main/settings";

export const rootRoute: Route = {
  beforeLoad: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  pendingComponent: () => <div>Loading...</div>,
  notFoundComponent: () => <div>404 Not Found</div>,
  component: RootLayout,
  children: [
    {
      component: MainLayout,
      children: [
        {
          name: "home-page",
          component: HomePage,
        },
        {
          name: "settings-page",
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
  console.log("App Rendered");
  return (
    <div className="h-screen w-screen">
      <Stack rootRoute={rootRoute} className="w-full h-full" />
    </div>
  );
};
