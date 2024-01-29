<template>
  <line
    v-for="(point, i) in visiblePoints.slice(0, -1)"
    :x1="point.x * scale.x + offset.x"
    :y1="point.y * scale.y + offset.y"
    :x2="visiblePoints[i + 1].x * scale.x + offset.x"
    :y2="visiblePoints[i + 1].y * scale.y + offset.y"
    :stroke="color"
    :stroke-width="lineWidth * invScale"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRef, watch } from "vue";

import { Color } from "../types.ts";
import { useGraphContext } from "../composables/useGraphContext.ts";
import { PossibleVector2, Vector2 } from "../math/Vector2.ts";
import { useColors } from "../composables/useColors.ts";

const props = withDefaults(
  defineProps<{
    function: (x: number, time?: number) => number;
    step?: number;
    color?: Color;
    animated?: boolean;
    domain?: PossibleVector2;
    lineWidth?: number;
    end?: number;
  }>(),
  {
    step: 0.1,
    animated: false,
    lineWidth: 1.25,
    end: Infinity,
  },
);

let animationFrameID: number | null = null;

const { domain, scale, offset, size, invScale } = useGraphContext();
const { parseColor } = useColors();

const color = parseColor(toRef(props, "color"), "stroke");

const points = ref<Vector2[]>([]);
const functionDomain = computed(() =>
  props.domain ? new Vector2(props.domain) : domain.value.x,
);

const visiblePoints = computed(() => {
  const range = Math.abs(functionDomain.value.x - functionDomain.value.y);
  const step = range / size.value.x;
  const i = Math.ceil((props.end - functionDomain.value.x) / step);
  return points.value.slice(0, i);
});

function updatePoints() {
  const now = Date.now();
  points.value = [];
  const range = Math.abs(functionDomain.value.x - functionDomain.value.y);
  const step = range / size.value.x;
  for (let i = 0; i <= size.value.x; i++) {
    const x = functionDomain.value.x + i * step;
    const y = props.function(x, now);
    points.value.push(new Vector2(x, -y));
  }
}

function animate() {
  updatePoints();
  animationFrameID = requestAnimationFrame(animate);
}

onMounted(() => {
  updatePoints();

  if (props.animated) {
    animate();
  }
});

watch(
  () => props.animated,
  (value) => {
    if (value) {
      animate();
    } else {
      if (animationFrameID) {
        cancelAnimationFrame(animationFrameID);
        animationFrameID = null;
      }
    }
  },
);
</script>
