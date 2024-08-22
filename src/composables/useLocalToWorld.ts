import { PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { Ref, computed, inject, provide, unref } from "vue";
import { parentToWorld as parentToWorldKey } from "../types.ts";
import { Matrix2D } from "../utils/Matrix2D.ts";

export function useLocalToWorld(
  localPosition: PossibleVector2 | Ref<PossibleVector2> = new Vector2(),
) {
  const parentToWorld = inject(
    parentToWorldKey,
    computed(() => new Matrix2D()),
  );

  const localToWorld = computed(() => {
    const position = Vector2.wrap(unref(localPosition));
    const transform = new Matrix2D().translate([position.x, position.y]);
    return parentToWorld.value.multiply(transform);
  });

  provide(parentToWorldKey, localToWorld);

  return parentToWorld;
}
