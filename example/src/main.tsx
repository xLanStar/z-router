import { RouterProvider, createRouterOptions } from "@modastar/z-router";
import ReactDOM from "react-dom/client";
import { App } from "./app/app";

const router = createRouterOptions({
  defaultUseTransition: () => true,
  defaultTransitionDuration: 300,
});

const rootElement = document.querySelector("#app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <RouterProvider options={router}>
      <App />
    </RouterProvider>
  );
}
