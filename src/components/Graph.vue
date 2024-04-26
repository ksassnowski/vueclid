<template>
  <svg
    ref="el"
    :viewBox="`${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`"
    :width="size.x"
    :height="size.y"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath :id="`clip-${id}`">
        <rect x="0" y="0" :width="width" :height="height" />
      </clipPath>
    </defs>

    <template v-if="grid">
      <defs>
        <pattern
          :id="id"
          :width="scale.x * gridSize"
          :height="scale.y * gridSize"
          patternUnits="userSpaceOnUse"
        >
          <path
            :d="`M 0 0 L 0 ${scale.y * gridSize} ${scale.x * gridSize} ${scale.y * gridSize} ${scale.x * gridSize} 0 0 0`"
            fill="none"
            :stroke="colors.grid"
            :stroke-width="0.75 * invScale"
          />
        </pattern>
      </defs>
      <rect :width="width" :height="height" :fill="`url(#${id})`"></rect>
    </template>

    <template v-if="axis">
      <line
        v-if="axisX"
        :x1="offset.x"
        :y1="0"
        :x2="offset.x"
        :y2="height"
        :stroke="colors.axis"
        :stroke-width="1.5 * invScale"
      />
      <line
        v-if="axisY"
        :x1="0"
        :y1="offset.y"
        :x2="width"
        :y2="offset.y"
        :stroke="colors.axis"
        :stroke-width="1.5 * invScale"
      />
    </template>

    <template v-if="units">
      <template
        v-for="i in Math.floor(Math.abs(domain.x.x - domain.x.y) / gridSize) +
        1"
      >
        <line
          :x1="scale.x * (i - 1) * gridSize"
          :y1="offset.y"
          :x2="scale.x * (i - 1) * gridSize"
          :y2="offset.y + 5"
          :stroke="colors.units"
          :stroke-width="1 * invScale"
        />

        <text
          :x="scale.x * (i - 1) * gridSize"
          :y="offset.y + 14"
          :style="`
            dominant-baseline: middle;
            text-anchor: middle;
            font-size: ${12 * invScale}px;
            font-family: sans-serif;
          `"
          :fill="colors.units"
        >
          {{ formatLabelValue((i - 1) * gridSize - origin.x) }}
        </text>
      </template>

      <template
        v-for="i in Math.floor(Math.abs(domain.y.x - domain.y.y) / gridSize) +
        1"
      >
        <line
          :x1="offset.x"
          :y1="scale.y * (i - 1) * gridSize"
          :x2="offset.x - 5"
          :y2="scale.y * (i - 1) * gridSize"
          :stroke="colors.units"
          :stroke-width="1 * invScale"
        />

        <text
          :x="offset.x - 14"
          :y="scale.y * (i - 1) * gridSize"
          :style="`
            dominant-baseline: middle;
            text-anchor: middle;
            font-size: ${12 * invScale}px;
            font-family: sans-serif;
          `"
          :fill="colors.units"
        >
          {{ formatLabelValue(origin.y - (i - 1) * gridSize) }}
        </text>
      </template>
    </template>

    <g :clip-path="`url(#clip-${id})`">
      <slot />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref } from "vue";

import { graphContext } from "../types.ts";
import { PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useColors } from "../composables/useColors.ts";

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
    padding?: number;
    gridSize?: number;
    origin?: PossibleVector2;
    domainX?: PossibleVector2;
    domainY?: PossibleVector2;
    axis?: boolean;
    axisX?: boolean;
    axisY?: boolean;
    grid?: boolean;
    units?: boolean;
  }>(),
  {
    width: 300,
    height: 300,
    padding: 30,
    gridSize: 1,
    domainX: () => new Vector2(-5, 5),
    domainY: () => new Vector2(-5, 5),
    axis: true,
    axisX: true,
    axisY: true,
    grid: true,
    units: true,
  },
);

const id = Math.random().toString(16).slice(2);
const { colors } = useColors();
const el = ref<SVGElement | null>();
const containerSize = ref(new Vector2(props.width, props.height));

const origin = computed(() => {
  if (props.origin) {
    return new Vector2(props.origin);
  }
  return new Vector2(
    (domain.value.x.y - domain.value.x.x) / 2,
    (domain.value.y.y - domain.value.y.x) / 2,
  );
});
const domain = computed(() => ({
  x: new Vector2(props.domainX),
  y: new Vector2(props.domainY),
}));
const offset = computed(() => origin.value.mul(scale.value));
const scale = computed(
  () =>
    new Vector2(
      props.width / Math.abs(domain.value.x.x - domain.value.x.y),
      props.height / Math.abs(domain.value.y.x - domain.value.y.y),
    ),
);
const aspect = computed(() => props.width / props.height);
const size = computed(() => {
  const width = Math.min(props.width, containerSize.value.x);
  const height = width / aspect.value;
  return new Vector2(width, height);
});
const invScale = computed(() => Math.max(1, props.width / size.value.x));

const context = {
  size,
  scale,
  origin,
  offset,
  domain,
  invScale,
};

provide(graphContext, context);

function formatLabelValue(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

onMounted(() => {
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    const contentBox = entry.contentBoxSize[0];
    containerSize.value.x = contentBox.inlineSize;
    containerSize.value.y = contentBox.blockSize;
  });
  observer.observe(el.value!.parentElement!);
});
</script>
