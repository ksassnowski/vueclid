<template>
  <circle
    v-bind="$attrs"
    :cx="position.x"
    :cy="position.y"
    :r="scaledRadius"
    :fill="fill"
    :stroke="stroke"
    :stroke-width="lineWidth * invScale"
    :stroke-dasharray="dashArray"
  />
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { type PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { type Color } from "../types.ts";
import { useColors } from "../composables/useColors.ts";

const props = withDefaults(
  defineProps<{
    radius: number;
    color?: Color;
    fill?: Color;
    position?: PossibleVector2;
    dashed?: boolean;
    lineWidth?: number;
  }>(),
  {
    position: () => new Vector2(),
    dashed: false,
    lineWidth: 1.5,
  },
);

const { matrix, invScale } = useGraphContext();
const { parseColor } = useColors();

const stroke = parseColor(toRef(props, "color"), "stroke");
const fill = parseColor(toRef(props, "fill"));

const position = computed(() =>
  new Vector2(props.position).transform(matrix.value),
);
const scaledRadius = computed(() => props.radius * matrix.value.a);
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
</script>
