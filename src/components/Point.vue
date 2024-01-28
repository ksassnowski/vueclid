<template>
  <circle
    :cx="scaledPosition.x"
    :cy="scaledPosition.y"
    :r="radius"
    :fill="filled ? color : 'none'"
    :stroke="filled ? 'none' : color"
    :stroke-width="lineWidth"
  />

  <Label
    v-if="label"
    :text="label"
    :position="labelPosition"
    :color="color"
    size="small"
  />
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { type Color } from "@/types.ts";
import { PossibleVector2, Vector2 } from "@/math/Vector2.ts";
import Label from "@/components/Label.vue";
import { useGraphContext } from "@/composables/useGraphContext.ts";
import { useColors } from "@/composables/useColors.ts";

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
  }>(),
  {
    radius: 4,
    position: () => new Vector2(),
    labelPosition: "bottom",
    filled: true,
    lineWidth: 1.5,
  },
);

const context = useGraphContext();
const { parseColor } = useColors();
const color = parseColor(toRef(props, "color"), "points");

const padding = 25;
const position = computed(() => new Vector2(props.position));
const scaledPosition = computed(() =>
  position.value
    .mul(new Vector2(1, -1))
    .mul(context.scale.value)
    .add(context.offset.value),
);
const labelPosition = computed(() => {
  switch (props.labelPosition) {
    case "top":
      return new Vector2(
        position.value.x,
        position.value.y + padding / context.scale.value.y,
      );
    case "bottom":
      return new Vector2(
        position.value.x,
        position.value.y - padding / context.scale.value.y,
      );
    case "left":
      return new Vector2(
        position.value.x - padding / context.scale.value.x,
        position.value.y,
      );
    case "right":
      return new Vector2(
        position.value.x + padding / context.scale.value.x,
        position.value.y,
      );
  }
});
</script>
