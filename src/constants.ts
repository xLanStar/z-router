import type { RouterOptions } from "./types.js";

export const DefaultRouterOptions: RouterOptions = {
  defaultTransitionDuration: 300,
};

export enum TransitionType {
  SlideLeft = "slide-left",
  SlideRight = "slide-right",
  NoTransition = "none",
}
