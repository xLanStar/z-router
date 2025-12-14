import { Stack, type Route } from "@modastar/z-router";
import { MainLayout } from "./_main";
import { NotFoundPage } from "./_not-found";
import { RootLayout } from "./_root";
import { HomePage } from "./main/home";
import { SettingsPage } from "./main/settings";

export const RootRoute: Route = {
  beforeLoad: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  pendingComponent: () => <div>Loading...</div>,
  notFoundComponent: NotFoundPage,
  component: RootLayout,
  children: [
    {
      pathname: "/",
      component: MainLayout,
      children: [
        {
          pathname: "home",
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
      <Stack route={RootRoute} className="w-full h-full" />
    </div>
  );
};
