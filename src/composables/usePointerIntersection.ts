import { Vector2 } from "src";
import { useGraphContext } from "./useGraphContext";
import { Ref, watch } from "vue";

export type IntersectionFn = (pointer: Vector2) => boolean;

export function usePointerIntersection(
  ref: Ref<boolean>,
  intersectionFn: IntersectionFn,
) {
  const { cursor } = useGraphContext();

  watch(cursor, (position: Vector2 | null) => {
    if (!position) {
      ref.value = false;
      return;
    }
    ref.value = intersectionFn(position);
  });
}
