<template>
  <polygon
    :points="`${points.map((p) => `${p.x},${p.y}`).join(' ')}`"
    :stroke="stroke"
    :stroke-width="lineWidth"
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
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { type Color } from "../types.ts";
import Angle from "./Angle.vue";
import { type PossibleVector2, Vector2 } from "../math/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";

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

const context = useGraphContext();
const { parseColor } = useColors();

const stroke = parseColor(toRef(props, "color"), "stroke");
const fill = parseColor(toRef(props, "fill"));

const vertices = computed(() => props.vertices.map((v) => Vector2.wrap(v)));
const points = computed(() =>
  vertices.value.map((v) =>
    v
      .mul(new Vector2(1, -1))
      .mul(context.scale.value)
      .add(context.offset.value),
  ),
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
