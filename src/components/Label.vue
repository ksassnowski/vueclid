<template>
  <g :transform="`rotate(${-rotation}, ${position.x}, ${position.y})`">
    <rect
      v-if="border"
      :x="position.x - boxWidth / 2"
      :y="position.y - boxHeight / 2 - 0.5"
      :width="boxWidth"
      :height="boxHeight"
      :fill="colors.labelBackground"
      :stroke="color"
      stroke-width="1.5"
      rx="6"
    />
    <text
      :x="position.x"
      :y="position.y"
      :style="`font-family: monospace; font-size: ${fontSize}px; dominant-baseline: middle; text-anchor: middle; font-weight: 500;`"
      :fill="color"
    >
      {{ text }}
    </text>
  </g>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { type Color } from "../types.ts";
import { type PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";

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

const { scale, offset, invScale } = useGraphContext();
const { colors, parseColor } = useColors();

const color = parseColor(toRef(props, "color"), "stroke");

const position = computed(() =>
  new Vector2(props.position)
    .mul(new Vector2(1, -1))
    .mul(scale.value)
    .add(offset.value),
);
const boxWidth = computed(
  () =>
    Math.max(
      (props.text.length + 1) * sizes[props.size],
      sizes[props.size] * 2.5,
    ) * invScale.value,
);
const boxHeight = computed(
  () => Math.min(sizes[props.size] * 3, boxWidth.value) * invScale.value,
);
const fontSize = computed(() => fontSizes[props.size] * invScale.value);
</script>
