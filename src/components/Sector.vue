<template>
  <path
    v-bind="$attrs"
    :d="`M ${position.x} ${position.y} L ${line1To.x} ${line1To.y} A ${scaledRadius} ${scaledRadius} 0 ${sweep} 0 ${line2To.x} ${line2To.y} L ${position.x} ${position.y} z`"
    :stroke="strokeColor"
    :stroke-width="lineWidth * invScale"
    stroke-linejoin="bevel"
    :fill="fillColor"
    :stroke-dasharray="dashArray"
  />
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";

import { type Color } from "../types.ts";
import { PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { DEG2RAD } from "../utils/constants.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { useColors } from "../composables/useColors.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { pointInsideSector } from "../utils/geometry.ts";

const props = withDefaults(
  defineProps<{
    color?: Color;
    fill?: Color;
    radius?: number;
    position?: PossibleVector2;
    from?: number;
    to: number;
    dashed?: boolean;
    lineWidth?: number;
    radians?: boolean;
  }>(),
  {
    position: () => new Vector2(),
    radius: 1,
    dashed: false,
    from: 0,
    lineWidth: 1.5,
    radians: false,
  },
);

const { matrix, invScale } = useGraphContext();
const { color, fill } = toRefs(props);
const { parseColor } = useColors();
const active = defineModel("active", { default: false });
usePointerIntersection(active, (point) => {
  const b = Vector2.wrap(props.position);
  const a = Vector2.fromPolar(from.value, props.radius).add(b);
  const c = Vector2.fromPolar(to.value, props.radius).add(b);
  return pointInsideSector(a, b, c, props.radius, point);
});

const strokeColor = parseColor(color, "stroke");
const fillColor = parseColor(fill);
const position = computed(() =>
  Vector2.wrap(props.position).transform(matrix.value),
);
const scaledRadius = computed(() => props.radius * matrix.value.a);
const from = computed(() =>
  props.radians ? props.from : props.from * DEG2RAD,
);
const to = computed(() => (props.radians ? props.to : props.to * DEG2RAD));
const line1To = computed(() =>
  Vector2.fromPolar(from.value, scaledRadius.value)
    .mul(new Vector2(1, -1))
    .add(position.value),
);
const line2To = computed(() =>
  Vector2.fromPolar(to.value, scaledRadius.value)
    .mul(new Vector2(1, -1))
    .add(position.value),
);
const dashArray = computed(() =>
  props.dashed ? [6 * invScale.value, 4 * invScale.value].join(",") : "0,0",
);
const sweep = computed(() => {
  const a = line2To.value;
  const b = position.value;
  const c = line1To.value;

  const orientation = b.x * (c.y - a.y) + a.x * (b.y - c.y) + c.x * (a.y - b.y);
  return orientation > 0 ? 1 : 0;
});
</script>
