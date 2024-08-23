<template>
  <path
    v-bind="$attrs"
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
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { useMatrices } from "../composables/useMatrices.ts";
import { distanceToLineSegment } from "../utils/geometry.ts";

const props = withDefaults(
  defineProps<{
    points: PossibleVector2[];
    color?: Color;
    lineWidth?: number;
    dashed?: boolean;
    highlightThreshold?: number;
  }>(),
  {
    dashed: false,
    lineWidth: 1.5,
    highlightThreshold: 0.25,
  },
);

const { invScale } = useGraphContext();
const { parentToWorld, cameraMatrix } = useMatrices();
const { parseColor } = useColors();

const color = parseColor(toRef(props, "color"), "stroke");
const active = defineModel("active", { default: false });
usePointerIntersection(active, (point) => {
  for (let i = 0; i < props.points.length - 1; i++) {
    const p0 = Vector2.wrap(props.points[i]).transform(cameraMatrix.value);
    const p1 = Vector2.wrap(props.points[i + 1]).transform(cameraMatrix.value);
    if (distanceToLineSegment(p0, p1, point) <= props.highlightThreshold) {
      return true;
    }
  }
  return false;
});

const parsedPoints = computed(() =>
  props.points.map((point) => Vector2.wrap(point).transform(parentToWorld.value)),
);
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
</script>
