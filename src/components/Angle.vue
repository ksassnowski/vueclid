<template>
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
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { PossibleVector2, Vector2 } from "../math/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { Color } from "../types.ts";
import { useColors } from "../composables/useColors.ts";

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
  }>(),
  {
    position: () => new Vector2(),
    radius: 1,
    dashed: false,
    lineWidth: 1.5,
  },
);

const { scale, offset, invScale } = useGraphContext();
const { parseColor } = useColors();

const stroke = parseColor(toRef(props, "color"), "stroke");
const fill = parseColor(toRef(props, "fill"));

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
const scaledB = computed(() =>
  b.value.mul(new Vector2(1, -1)).mul(scale.value).add(offset.value),
);
const scaledRadius = computed(() => props.radius * scale.value.x);
const start = computed(() => {
  const direction = a.value.sub(b.value).normalized().mul(new Vector2(1, -1));
  return b.value
    .mul(new Vector2(1, -1))
    .add(direction.scale(props.radius))
    .mul(scale.value)
    .add(offset.value);
});
const end = computed(() => {
  const direction = c.value.sub(b.value).normalized().mul(new Vector2(1, -1));
  return b.value
    .mul(new Vector2(1, -1))
    .add(direction.scale(props.radius))
    .mul(scale.value)
    .add(offset.value);
});
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
</script>
