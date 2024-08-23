import type { ComputedRef, InjectionKey } from "vue";
import { Vector2 } from "./utils/Vector2.ts";
import { Matrix2D } from "./utils/Matrix2D.ts";

export type Color = string | { light: string; dark: string };

export const graphContext = Symbol() as InjectionKey<{
  size: ComputedRef<Vector2>;
  scale: ComputedRef<Vector2>;
  invScale: ComputedRef<number>;
  origin: ComputedRef<Vector2>;
  cursor: ComputedRef<Vector2 | null>;
  offset: ComputedRef<Vector2>;
  domain: ComputedRef<{ x: Vector2; y: Vector2 }>;
  matrix: ComputedRef<Matrix2D>;
}>;

export const parentToWorld = Symbol() as InjectionKey<ComputedRef<Matrix2D>>;
export const cameraMatrixKey = Symbol() as InjectionKey<ComputedRef<Matrix2D>>;
