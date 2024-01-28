import { computed, readonly, Ref, ref, unref } from "vue";
import { Color } from "@/types.ts";

interface ColorScheme {
  grid: string;
  units: string;
  axis: string;
  stroke: string;
  text: string;
  labelBackground: string;
  points: string;
}
type Colors = { light: ColorScheme; dark: ColorScheme };

let colorScheme: Colors = {
  light: {
    grid: "#ccc",
    units: "#aaa",
    axis: "#ccc",
    stroke: "#000",
    text: "#000",
    labelBackground: "#ffffffcc",
    points: "#000",
  },
  dark: {
    grid: "#646262",
    units: "#727171",
    axis: "#6f6f6f",
    stroke: "#f1f1f1",
    text: "#f1f1f1",
    labelBackground: "#222222cc",
    points: "#f1f1f1",
  },
};
const darkMode = ref(false);
const colors = computed(() =>
  darkMode.value ? colorScheme.dark : colorScheme.light,
);

function setDarkMode(value: boolean) {
  darkMode.value = value;
}

function parseColor(
  color: Color | Ref<Color | undefined> | undefined,
  fallback?: keyof ColorScheme,
) {
  return computed(() => {
    const value = unref(color);

    if (typeof value === "string") {
      return value;
    }

    if (value === undefined) {
      if (fallback === undefined) {
        return "none";
      }
      return colors.value[fallback];
    }

    return darkMode.value ? value.dark : value.light;
  });
}

function setColors(colors: {
  light?: Partial<ColorScheme>;
  dark?: Partial<ColorScheme>;
}) {
  colorScheme = {
    light: { ...colorScheme.light, ...colors.light },
    dark: { ...colorScheme.dark, ...colors.dark },
  };
}

export function useColors() {
  return {
    setColors,
    setDarkMode,
    parseColor,
    colors: readonly(colors),
  };
}
