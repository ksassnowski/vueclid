<template>
  <Angle
    :a="a"
    :b="position"
    :c="c"
    :radius="radius"
    :dashed="dashed"
    :line-width="lineWidth"
    :color="color"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

import { type PossibleVector2, Vector2 } from "../math/Vector2.ts";
import { DEG2RAD } from "../math/constants.ts";
import Angle from "../components/Angle.vue";
import { useColors } from "../composables/useColors.ts";

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
  }>(),
  {
    from: 0,
    position: () => new Vector2(),
    dashed: false,
    radius: 3,
    lineWidth: 1.25,
    radians: false,
  },
);

const { colors } = useColors();
const color = computed(() => props.color ?? colors.value.stroke);

const position = computed(() => Vector2.wrap(props.position));
const a = computed(() => {
  const angle = props.radians ? props.from : props.from * DEG2RAD;
  return Vector2.fromAngle(angle).add(position.value);
});
const c = computed(() => {
  const angle = props.radians ? props.to : props.to * DEG2RAD;
  return Vector2.fromAngle(angle).add(position.value);
});
</script>
