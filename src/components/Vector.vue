<template>
  <g v-bind="$attrs">
    <defs>
      <marker
        :id="id"
        :refY="arrowSize / 3"
        :markerWidth="arrowSize"
        :markerHeight="arrowSize / 1.5"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <polygon
          :points="`0 0, ${arrowSize} ${arrowSize / 3}, 0 ${arrowSize / 1.5}`"
          :fill="color"
        />
      </marker>
    </defs>

    <line
      :x1="from.x"
      :y1="from.y"
      :x2="to.x"
      :y2="to.y"
      :stroke-width="lineWidth * invScale"
      :stroke="color"
      :stroke-dasharray="dashArray"
      :marker-end="`url(#${id})`"
    />

    <Label
      v-if="label"
      :text="label"
      :position="labelPosition"
      :color="color"
      :size="labelSize"
    />
  </g>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { type PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import Label from "../components/Label.vue";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { distanceToLineSegment } from "../utils/geometry.ts";

const props = withDefaults(
  defineProps<{
    from?: PossibleVector2;
    to: PossibleVector2;
    color?: string;
    dashed?: boolean;
    label?: string;
    labelSize?: "small" | "normal" | "large";
    lineWidth?: number;
    arrowSize?: number;
    highlightThreshold?: number;
  }>(),
  {
    from: () => new Vector2(),
    dashed: false,
    lineWidth: 1.75,
    labelSize: "normal",
    arrowSize: 18,
    highlightThreshold: 0.25,
  },
);

const id = Math.random().toString(16).slice(2);

const { matrix, invScale } = useGraphContext();
const { colors } = useColors();
const color = computed(() => props.color ?? colors.value.stroke);
const active = defineModel("active", { default: false });
usePointerIntersection(
  active,
  (point) =>
    distanceToLineSegment(
      Vector2.wrap(props.from),
      Vector2.wrap(props.to),
      point,
    ) <= props.highlightThreshold,
);

const pixelVector = computed(() =>
  Vector2.wrap(props.to).transform(matrix.value).sub(from.value),
);
const from = computed(() => Vector2.wrap(props.from).transform(matrix.value));
const to = computed(() => {
  const angle = pixelVector.value.angle;
  const magnitude = pixelVector.value.length();
  const newMagnitude = magnitude - arrowSize.value;
  return new Vector2(
    from.value.x + newMagnitude * Math.cos(angle),
    from.value.y + newMagnitude * Math.sin(angle),
  );
});
const labelPosition = computed(() => {
  const fromVector = Vector2.wrap(props.from);
  const toVector = Vector2.wrap(props.to).sub(fromVector);
  return fromVector.add(toVector.normalized().scale(toVector.length() / 2));
});
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
const arrowSize = computed(
  () =>
    Math.min(props.arrowSize, pixelVector.value.length() / 2) * invScale.value,
);
</script>
