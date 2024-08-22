import { Vector2 } from "../utils/Vector2.ts";
import { computed, inject, provide } from "vue";
import { parentToWorld } from "../types.ts";
import {Matrix2D} from "../utils/Matrix2D.ts";

export function useLocalToWorld(localPosition: Vector2) {
  const parentMatrix = inject(
      parentToWorld, 
      computed(() => new Matrix2D()),
  );

  const transform = new Matrix2D();
  transform.translate([localPosition.x, localPosition.y]);
  const matrix = computed(() => parentMatrix.value.multiply(transform));

  provide(parentToWorld, matrix);

  return matrix;
}
