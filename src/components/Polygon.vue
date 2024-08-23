<template>
  <g v-bind="$attrs">
    <polygon
      :points="`${points.map((p) => `${p.x},${p.y}`).join(' ')}`"
      :stroke="stroke"
      :stroke-width="lineWidth * invScale"
      :fill="fill"
    />

    <Angle
      v-if="props.angles"
      v-for="angle in angles"
      :a="angle.a"
      :b="angle.b"
      :c="angle.c"
      :radius="angleRadius"
      :dashed="angleDashed"
    />

    <slot />
  </g>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { type Color } from "../types.ts";
import Angle from "./Angle.vue";
import { type PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { useMatrices } from "../composables/useMatrices.ts";
import { pointInsidePolygon } from "../utils/geometry.ts";

const props = withDefaults(
  defineProps<{
    vertices: PossibleVector2[];
    color?: Color;
    fill?: Color;
    lineWidth?: number;
    angles?: boolean;
    angleRadius?: number;
    angleDashed?: boolean;
  }>(),
  {
    lineWidth: 1.25,
    angles: false,
    angleRadius: 1,
    angleDashed: true,
  },
);

if (props.vertices.length < 3) {
  throw new Error("A polygon must have at least 3 vertices");
}

const { invScale } = useGraphContext();
const { parseColor } = useColors();
const { parentToWorld, cameraMatrix } = useMatrices();

const stroke = parseColor(toRef(props, "color"), "stroke");
const fill = parseColor(toRef(props, "fill"));
const active = defineModel("active", { default: false });
usePointerIntersection(active, (point) =>
  pointInsidePolygon(
    props.vertices.map((v) => Vector2.wrap(v).transform(cameraMatrix.value)),
    point,
  ),
);

const vertices = computed(() => props.vertices.map(Vector2.wrap));
const points = computed(() =>
  vertices.value.map((v) => v.transform(parentToWorld.value)),
);
const angles = computed(() => {
  const result = [];
  for (let i = 0; i < vertices.value.length; i++) {
    const a =
      vertices.value[(i - 1 + vertices.value.length) % vertices.value.length];
    const b = vertices.value[i];
    const c = vertices.value[(i + 1) % vertices.value.length];
    result.push({ a, b, c });
  }
  return result;
});
</script>
