import { PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { Ref, computed, inject, provide, unref } from "vue";
import {
  cameraMatrixKey,
  parentToWorld as parentToWorldKey,
} from "../types.ts";
import { Matrix2D } from "../utils/Matrix2D.ts";

export function useMatrices(
  localPosition: PossibleVector2 | Ref<PossibleVector2> = new Vector2(),
) {
  const parentToWorld = inject(
    parentToWorldKey,
    computed(() => new Matrix2D()),
  );
  const parentToCamera = inject(
    cameraMatrixKey,
    computed(() => new Matrix2D()),
  );

  const cameraMatrix = computed(() => {
    const transform = new Matrix2D().translate(
      Vector2.wrap(unref(localPosition)),
    );
    return parentToCamera.value.multiply(transform);
  });

  const cameraPosition = computed(() =>
    Vector2.wrap(unref(localPosition)).transform(parentToCamera.value),
  );

  const localToWorld = computed(() => {
    const position = Vector2.wrap(unref(localPosition));
    const transform = new Matrix2D().translate([position.x, position.y]);
    return parentToWorld.value.multiply(transform);
  });

  provide(parentToWorldKey, localToWorld);
  provide(cameraMatrixKey, cameraMatrix);

  return { parentToWorld, cameraMatrix, cameraPosition };
}
