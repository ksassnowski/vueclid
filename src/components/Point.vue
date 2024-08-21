<template>
  <g v-bind="$attrs">
    <circle
      :cx="scaledPosition.x"
      :cy="scaledPosition.y"
      :r="radius"
      :fill="filled ? color : 'none'"
      :stroke="filled ? 'none' : color"
      :stroke-width="lineWidth * invScale"
    />

    <Label
      v-if="label"
      v-model:active="labelActive"
      :text="label"
      :position="labelPosition"
      :color="color"
      size="small"
    />

    <slot />
  </g>
</template>

<script setup lang="ts">
import { ref, computed, toRef } from "vue";

import { type Color } from "../types.ts";
import { type PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import Label from "./Label.vue";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { useLocalToWorld } from "../composables/useLocalToWorld.ts";
import { pointInsideCircle } from "../utils/geometry.ts";

type LabelPosition = "top" | "bottom" | "left" | "right";

const props = withDefaults(
  defineProps<{
    radius?: number;
    color?: Color;
    position?: PossibleVector2;
    labelPosition?: LabelPosition;
    label?: string;
    filled?: boolean;
    lineWidth?: number;
    highlightThreshold?: number;
  }>(),
  {
    radius: 4,
    position: () => new Vector2(),
    labelPosition: "bottom",
    filled: true,
    lineWidth: 1.5,
    highlightThreshold: 0.1,
  },
);

const { invScale } = useGraphContext();
const matrix = useLocalToWorld(toRef(props, "position"));
const { parseColor } = useColors();
const color = parseColor(toRef(props, "color"), "points");
const labelActive = ref(false);
const active = defineModel("active", { default: false });
usePointerIntersection(active, (point) => {
  const center = position.value;
  const pointActive = pointInsideCircle(
    center,
    (props.radius + props.lineWidth) / matrix.value.a +
      props.highlightThreshold,
    point,
  );
  if (!props.label) {
    return pointActive;
  }
  return labelActive.value || pointActive;
});

const padding = 25;
const position = computed(() => new Vector2(props.position));
const scaledPosition = computed(() => position.value.transform(matrix.value));
const labelPosition = computed(() => {
  switch (props.labelPosition) {
    case "top":
      return new Vector2(
        position.value.x,
        position.value.y + padding / matrix.value.d,
      );
    case "bottom":
      return new Vector2(
        position.value.x,
        position.value.y - padding / matrix.value.d,
      );
    case "left":
      return new Vector2(
        position.value.x - padding / matrix.value.a,
        position.value.y,
      );
    case "right":
      return new Vector2(
        position.value.x + padding / matrix.value.a,
        position.value.y,
      );
  }
});
</script>
