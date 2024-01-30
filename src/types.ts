import type { ComputedRef, InjectionKey } from "vue";
import { Vector2 } from "./utils/Vector2.ts";

export type Color = string | { light: string; dark: string };

export const graphContext = Symbol() as InjectionKey<{
  size: ComputedRef<Vector2>;
  scale: ComputedRef<Vector2>;
  invScale: ComputedRef<number>;
  origin: ComputedRef<Vector2>;
  offset: ComputedRef<Vector2>;
  domain: ComputedRef<{ x: Vector2; y: Vector2 }>;
}>;
