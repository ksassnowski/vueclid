<template>
  <line
    :x1="from.x"
    :y1="from.y"
    :x2="to.x"
    :y2="to.y"
    :stroke="color"
    :stroke-width="lineWidth"
    :stroke-dasharray="dashArray"
  />
  <Label
    v-if="label"
    :text="label"
    :position="labelPosition"
    :color="color"
    :size="labelSize"
  />
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { PossibleVector2, Vector2 } from "@/math/Vector2.ts";
import Label from "@/components/Label.vue";
import { useGraphContext } from "@/composables/useGraphContext.ts";
import { useColors } from "@/composables/useColors.ts";
import { type Color } from "@/types.ts";

const props = withDefaults(
  defineProps<{
    slope?: number;
    yIntercept?: number;
    from?: PossibleVector2;
    to?: PossibleVector2;
    color?: Color;
    dashed?: boolean;
    lineWidth?: number;
    label?: string;
    labelSize?: "small" | "normal" | "large";
  }>(),
  {
    dashed: false,
    lineWidth: 1.75,
    yIntercept: 0,
    labelSize: "small",
  },
);

if (props.to === undefined && props.slope === undefined) {
  throw new Error("Line requires either a `to` prop or a `slope` prop");
}

const context = useGraphContext();
const { parseColor } = useColors();

const color = parseColor(toRef(props, "color"), "stroke");

function clamp(x: number, min: number, max: number) {
  return Math.min(max, Math.max(min, x));
}

const from = computed(() => {
  if (props.from) {
    return new Vector2(props.from)
      .mul(new Vector2(1, -1))
      .mul(context.scale.value)
      .add(context.offset.value);
  }

  if (props.to) {
    return new Vector2(0, 0)
      .mul(new Vector2(1, -1))
      .mul(context.scale.value)
      .add(context.offset.value);
  }

  let x = (context.domain.value.y.x - props.yIntercept) / props.slope!;
  x = clamp(x, context.domain.value.x.x, context.domain.value.x.y);
  const y = props.slope! * x + props.yIntercept;
  return new Vector2(x, y)
    .mul(new Vector2(1, -1))
    .mul(context.scale.value)
    .add(context.offset.value);
});
const to = computed(() => {
  if (props.to) {
    return new Vector2(props.to)
      .mul(new Vector2(1, -1))
      .mul(context.scale.value)
      .add(context.offset.value);
  }

  let x = (context.domain.value.y.y - props.yIntercept) / props.slope!;
  x = clamp(x, context.domain.value.x.x, context.domain.value.x.y);
  const y = props.slope! * x + props.yIntercept;
  return new Vector2(x, y)
    .mul(new Vector2(1, -1))
    .mul(context.scale.value)
    .add(context.offset.value);
});
const labelPosition = computed(() => {
  const localSpaceFrom = from.value
    .sub(context.offset.value)
    .div(context.scale.value)
    .mul(new Vector2(1, -1));
  const localSpaceTo = to.value
    .sub(context.offset.value)
    .div(context.scale.value)
    .mul(new Vector2(1, -1));
  const diff = localSpaceTo.sub(localSpaceFrom);
  return localSpaceFrom.add(diff.normalized().scale(diff.length() / 2));
});
const dashArray = computed(() => (props.dashed ? "6,4" : "0,0"));
</script>
