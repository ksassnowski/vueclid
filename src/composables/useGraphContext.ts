import { inject } from "vue";
import { graphContext } from "../types.ts";

export function useGraphContext() {
  const context = inject(graphContext);

  if (!context) {
    throw new Error("Component is missing a parent <Graph> component.");
  }

  return context;
}
