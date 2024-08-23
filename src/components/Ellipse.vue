<template>
  <g v-bind="$attrs">
    <ellipse
      :cx="position.x"
      :cy="position.y"
      :rx="scaledRadius.x"
      :ry="scaledRadius.y"
      :fill="fill"
      :stroke="stroke"
      :stroke-width="lineWidth * invScale"
      :stroke-dasharray="dashArray"
      :transform="`rotate(${-rotation}, ${position.x}, ${position.y})`"
    />
    <slot />
  </g>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { type PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { type Color } from "../types.ts";
import { useColors } from "../composables/useColors.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { useMatrices } from "../composables/useMatrices.ts";
import { pointInsideEllipse } from "../utils/geometry.ts";

const props = withDefaults(
  defineProps<{
    radius?: PossibleVector2;
    color?: Color;
    fill?: Color;
    position?: PossibleVector2;
    dashed?: boolean;
    lineWidth?: number;
    rotation?: number;
    radians?: boolean;
  }>(),
  {
    radius: () => new Vector2(1, 1),
    position: () => new Vector2(),
    dashed: false,
    lineWidth: 1.5,
    rotation: 0,
    radians: false,
  },
);

const { invScale } = useGraphContext();
const { parentToWorld, cameraPosition } = useMatrices(toRef(props, "position"));
const { parseColor } = useColors();

const stroke = parseColor(toRef(props, "color"), "stroke");
const fill = parseColor(toRef(props, "fill"));
const active = defineModel("active", { default: false });
usePointerIntersection(active, (point) =>
  pointInsideEllipse(cameraPosition.value, Vector2.wrap(props.radius), point),
);

const position = computed(() =>
  new Vector2(props.position).transform(parentToWorld.value),
);
const scaledRadius = computed(() =>
  new Vector2(props.radius).mul([
    parentToWorld.value.a,
    Math.abs(parentToWorld.value.d),
  ]),
);
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
const rotation = computed(() =>
  props.radians ? (props.rotation * 180) / Math.PI : props.rotation,
);
</script>
