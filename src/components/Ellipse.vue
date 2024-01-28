<template>
  <ellipse
    :cx="position.x"
    :cy="position.y"
    :rx="scaledRadius.x"
    :ry="scaledRadius.y"
    :fill="fill"
    :stroke="stroke"
    :stroke-width="lineWidth"
    :stroke-dasharray="dashArray"
  />
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { type PossibleVector2, Vector2 } from "@/math/Vector2.ts";
import { useGraphContext } from "@/composables/useGraphContext.ts";
import { type Color } from "@/types.ts";
import { useColors } from "@/composables/useColors.ts";

const props = withDefaults(
  defineProps<{
    radius?: PossibleVector2;
    color?: Color;
    fill?: Color;
    position?: PossibleVector2;
    dashed?: boolean;
    lineWidth?: number;
  }>(),
  {
    radius: () => new Vector2(1, 1),
    position: () => new Vector2(),
    dashed: false,
    lineWidth: 1.5,
  },
);

const context = useGraphContext();
const { parseColor } = useColors();

const stroke = parseColor(toRef(props, "color"), "stroke");
const fill = parseColor(toRef(props, "fill"));

const position = computed(() =>
  new Vector2(props.position)
    .mul(new Vector2(1, -1))
    .mul(context.scale.value)
    .add(context.offset.value),
);
const scaledRadius = computed(() =>
  new Vector2(props.radius).mul(context.scale.value),
);
const dashArray = computed(() => (props.dashed ? "6,4" : "0,0"));
</script>