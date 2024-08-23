<template>
  <Angle
    v-bind="$attrs"
    :a="a"
    :b="0"
    :c="c"
    :radius="radius"
    :dashed="dashed"
    :line-width="lineWidth"
    :color="color"
    :label="label"
    :label-size="labelSize"
  >
    <slot />
  </Angle>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { DEG2RAD } from "../utils/constants.ts";
import Angle from "../components/Angle.vue";
import { useColors } from "../composables/useColors.ts";
import { type PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { usePointerIntersection } from "../composables/usePointerIntersection.ts";
import { useMatrices } from "../composables/useMatrices.ts";
import { distanceToArc } from "../utils/geometry.ts";

const props = withDefaults(
  defineProps<{
    position?: PossibleVector2;
    from?: number;
    to: number;
    radius?: number;
    color?: string;
    dashed?: boolean;
    lineWidth?: number;
    radians?: boolean;
    label?: string;
    labelSize?: "small" | "normal" | "large";
    highlightThreshold?: number;
  }>(),
  {
    from: 0,
    position: () => new Vector2(),
    dashed: false,
    radius: 3,
    lineWidth: 1.25,
    radians: false,
    labelSize: "small",
    highlightThreshold: 0.25,
  },
);

const { colors } = useColors();
const color = computed(() => props.color ?? colors.value.stroke);
const active = defineModel("active", { default: false });
const { cameraPosition } = useMatrices(toRef(props, "position"));
usePointerIntersection(active, (point) => {
  const fromAngle = props.radians ? props.from : props.from * DEG2RAD;
  const toAngle = props.radians ? props.to : props.to * DEG2RAD;
  return (
    distanceToArc(
      cameraPosition.value,
      fromAngle,
      toAngle,
      props.radius,
      point,
    ) <= props.highlightThreshold
  );
});

const a = computed(() => {
  const angle = props.radians ? props.from : props.from * DEG2RAD;
  return Vector2.fromAngle(angle);
});
const c = computed(() => {
  const angle = props.radians ? props.to : props.to * DEG2RAD;
  return Vector2.fromAngle(angle);
});
</script>
