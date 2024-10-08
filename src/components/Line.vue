<template>
  <g v-bind="$attrs">
    <line
      :x1="from.x"
      :y1="from.y"
      :x2="to.x"
      :y2="to.y"
      :stroke="color"
      :stroke-width="lineWidth * invScale"
      :stroke-dasharray="dashArray"
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

import { type Color } from "../types.ts";
import { PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import Label from "./Label.vue";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { useMatrices } from "../composables/useMatrices.ts";
import { distanceToLineSegment } from "../utils/geometry.ts";

const props = withDefaults(
  defineProps<{
    slope?: number;
    yIntercept?: number;
    from?: PossibleVector2;
    to?: PossibleVector2;
    color?: Color;
    dashed?: boolean;
    lineWidth?: number;
    label?: string;
    labelSize?: "small" | "normal" | "large";
    highlightThreshold?: number;
  }>(),
  {
    dashed: false,
    lineWidth: 1.75,
    yIntercept: 0,
    labelSize: "small",
    highlightThreshold: 0.25,
  },
);

if (props.to === undefined && props.slope === undefined) {
  throw new Error("Line requires either a `to` prop or a `slope` prop");
}

const { domain, invScale } = useGraphContext();
const { parseColor } = useColors();
const { parentToWorld, cameraMatrix } = useMatrices();

const color = parseColor(toRef(props, "color"), "stroke");
const active = defineModel("active", { default: false });
usePointerIntersection(active, (point) => {
  const matrix = cameraMatrix.value.multiply(parentToWorld.value.inverse);
  return (
    distanceToLineSegment(
      from.value.transform(matrix),
      to.value.transform(matrix),
      point,
    ) <= props.highlightThreshold
  );
});

function clamp(x: number, min: number, max: number) {
  return Math.min(max, Math.max(min, x));
}

const from = computed(() => {
  if (props.from) {
    return new Vector2(props.from).transform(parentToWorld.value);
  }

  if (props.to) {
    return new Vector2(0, 0).transform(parentToWorld.value);
  }

  let x = (domain.value.y.x - props.yIntercept) / props.slope!;
  x = clamp(
    x,
    domain.value.x.x + cameraMatrix.value.tx,
    domain.value.x.y - cameraMatrix.value.tx,
  );
  const y = props.slope! * x + props.yIntercept;
  return new Vector2(x, y).transform(parentToWorld.value);
});
const to = computed(() => {
  if (props.to) {
    return new Vector2(props.to).transform(parentToWorld.value);
  }

  let x = (domain.value.y.y - props.yIntercept) / props.slope!;
  x = clamp(
    x,
    domain.value.x.x + cameraMatrix.value.tx,
    domain.value.x.y - cameraMatrix.value.tx,
  );
  const y = props.slope! * x + props.yIntercept;
  return new Vector2(x, y).transform(parentToWorld.value);
});
const labelPosition = computed(() => {
  const worldToLocal = parentToWorld.value.inverse;
  const localSpaceFrom = from.value.transform(worldToLocal);
  const localSpaceTo = to.value.transform(worldToLocal);
  const diff = localSpaceTo.sub(localSpaceFrom);
  return localSpaceFrom.add(diff.normalized().scale(diff.length() / 2));
});
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
</script>
