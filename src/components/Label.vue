<template>
  <g
    v-bind="$attrs"
    :transform="`rotate(${-rotation}, ${position.x}, ${position.y})`"
  >
    <rect
      v-if="border"
      :x="position.x - scaledBoxWidth / 2"
      :y="position.y - scaledBoxHeight / 2 - 0.5"
      :width="scaledBoxWidth"
      :height="scaledBoxHeight"
      :fill="colors.labelBackground"
      :stroke="color"
      stroke-width="1.5"
      rx="6"
    />
    <text
      :x="position.x"
      :y="position.y"
      :style="`font-family: monospace; font-size: ${fontSize}px; dominant-baseline: middle; text-anchor: middle; font-weight: 500; user-select: none;`"
      :fill="color"
    >
      {{ text }}
    </text>

    <slot />
  </g>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { type Color } from "../types.ts";
import { type PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { useMatrices } from "../composables/useMatrices.ts";
import { pointInsideRectangle } from "../utils/geometry.ts";

const props = withDefaults(
  defineProps<{
    size?: keyof typeof sizes;
    color?: Color;
    position?: PossibleVector2;
    rotation?: number;
    border?: boolean;
    text: string;
  }>(),
  {
    size: "normal",
    position: () => new Vector2(),
    rotation: 0,
    border: true,
  },
);

const fontSizes = {
  small: 12,
  normal: 14,
  large: 16,
};

const sizes = {
  small: 8,
  normal: 10,
  large: 12,
};

const { invScale } = useGraphContext();
const { parentToWorld, cameraPosition } = useMatrices(toRef(props, "position"));
const { colors, parseColor } = useColors();

const color = parseColor(toRef(props, "color"), "stroke");
const active = defineModel("active", { default: false });
usePointerIntersection(active, (point) => {
  const width = boxWidth.value / parentToWorld.value.a;
  const height = boxHeight.value / parentToWorld.value.a;
  return pointInsideRectangle(
    cameraPosition.value,
    new Vector2(width, height),
    point,
  );
});

const position = computed(() =>
  Vector2.wrap(props.position).transform(parentToWorld.value),
);
const boxWidth = computed(() =>
  Math.max(
    (props.text.length + 1) * sizes[props.size],
    sizes[props.size] * 2.5,
  ),
);
const scaledBoxWidth = computed(() => boxWidth.value * invScale.value);
const boxHeight = computed(() =>
  Math.min(sizes[props.size] * 3, boxWidth.value),
);
const scaledBoxHeight = computed(() => boxHeight.value * invScale.value);
const fontSize = computed(() => fontSizes[props.size] * invScale.value);
</script>
