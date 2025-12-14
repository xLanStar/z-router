import { RouterProvider, createRouterOptions } from "@modastar/z-router";
import ReactDOM from "react-dom/client";
import { App } from "./app/app";
import { HeroUIProvider } from "./components/heroUIProvider";

const router = createRouterOptions({
  defaultTransitionType: (from, to) =>
    from?.index <= to?.index ? "slide-left" : "slide-right",
  defaultTransitionDuration: 300,
});

const rootElement = document.querySelector("#app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <RouterProvider options={router}>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </RouterProvider>
  );
}
