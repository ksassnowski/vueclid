<template>
  <g v-bind="$attrs">
    <slot />
  </g>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { PossibleVector2, Vector2 } from "../utils/Vector2.ts";
import { useMatrices } from "../composables/useMatrices.ts";

const props = withDefaults(
  defineProps<{ position?: PossibleVector2; }>(), { position: () => new Vector2() });

useMatrices(toRef(props, "position"));
</script>
