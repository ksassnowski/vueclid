<template>
  <path
    :d="`M ${parsedPoints[0].x} ${parsedPoints[0].y} L ${parsedPoints
      .slice(1)
      .map((point) => `${point.x} ${point.y}`)
      .join(' ')}`"
    :stroke-width="lineWidth * invScale"
    :stroke="color"
    :stroke-dasharray="dashArray"
    fill="none"
  />
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { type Color } from "../types.ts";
import { PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";

const props = withDefaults(
  defineProps<{
    points: PossibleVector2[];
    color?: Color;
    lineWidth?: number;
    dashed?: boolean;
  }>(),
  {
    dashed: false,
    lineWidth: 1.5,
  },
);

const { scale, offset, invScale } = useGraphContext();
const { parseColor } = useColors();

const color = parseColor(toRef(props, "color"), "stroke");

const parsedPoints = computed(() =>
  props.points.map((point) =>
    Vector2.wrap(point)
      .mul(new Vector2(1, -1))
      .mul(scale.value)
      .add(offset.value),
  ),
);
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
</script>
