<template>
  <g v-bind="$attrs">
    <path
      v-if="fill"
      :d="`M ${scaledB.x} ${scaledB.y} L ${start.x} ${start.y} A ${scaledRadius} ${scaledRadius} 0 ${sweep} 0 ${end.x} ${end.y}`"
      stroke="none"
      :fill="fill"
    />

    <path
      :d="`M ${start.x} ${start.y} A ${scaledRadius} ${scaledRadius} 0 ${sweep} 0 ${end.x} ${end.y}`"
      :stroke-width="lineWidth * invScale"
      :stroke="stroke"
      :stroke-dasharray="dashArray"
      fill="none"
    />

    <Label
      v-if="label"
      :text="label"
      :position="labelPosition"
      :color="color"
      :size="labelSize"
    />

    <slot />
  </g>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { Color } from "../types.ts";
import { useColors } from "../composables/useColors.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { useLocalToWorld } from "../composables/useLocalToWorld.ts";
import { pointInsideSector } from "../utils/geometry.ts";
import Label from "./Label.vue";

const props = withDefaults(
  defineProps<{
    color?: Color;
    fill?: Color;
    radius?: number;
    a: PossibleVector2;
    b: PossibleVector2;
    c: PossibleVector2;
    dashed?: boolean;
    lineWidth?: number;
    label?: string;
    labelSize?: "small" | "normal" | "large";
  }>(),
  {
    position: () => new Vector2(),
    radius: 1,
    dashed: false,
    lineWidth: 1.5,
    labelSize: "small",
  },
);

const { invScale } = useGraphContext();
const matrix = useLocalToWorld(toRef(props, "position"));
const { parseColor } = useColors();

const stroke = parseColor(toRef(props, "color"), "stroke");
const fill = parseColor(toRef(props, "fill"));
const active = defineModel("active", { default: false });
usePointerIntersection(active, (point) =>
  pointInsideSector(a.value, b.value, c.value, props.radius, point),
);

const a = computed(() => Vector2.wrap(props.a));
const b = computed(() => Vector2.wrap(props.b));
const c = computed(() => Vector2.wrap(props.c));
const sweep = computed(() => {
  const orientation =
    b.value.x * (c.value.y - a.value.y) +
    a.value.x * (b.value.y - c.value.y) +
    c.value.x * (a.value.y - b.value.y);
  return orientation > 0 ? 1 : 0;
});
const scaledB = computed(() => b.value.transform(matrix.value));
const scaledRadius = computed(() => props.radius * matrix.value.a);
const start = computed(() => {
  const direction = a.value.sub(b.value).normalized();
  return b.value.add(direction.scale(props.radius)).transform(matrix.value);
});
const end = computed(() => {
  const direction = c.value.sub(b.value).normalized();
  return b.value.add(direction.scale(props.radius)).transform(matrix.value);
});
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
const labelPosition = computed(() => {
  const bToA = a.value.sub(b.value);
  const bToC = c.value.sub(b.value);
  return bToA
    .normalized()
    .scale(props.radius)
    .rotate(bToA.clockwiseAngleTo(bToC) / 2)
    .add(b.value);
});
</script>
