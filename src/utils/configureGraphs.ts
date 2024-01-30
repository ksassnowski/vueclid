import {
  type ColorScheme,
  colorScheme,
  darkMode,
} from "../composables/useColors";

interface GraphOptions {
  darkMode?: boolean;
  colors?: {
    light?: Partial<ColorScheme>;
    dark?: Partial<ColorScheme>;
  };
}

export function configureGraphs(options: GraphOptions) {
  if (options.colors) {
    colorScheme.light = { ...colorScheme.light, ...options.colors.light };
    colorScheme.dark = { ...colorScheme.dark, ...options.colors.dark };
  }

  if (options.darkMode !== undefined) {
    darkMode.value = options.darkMode;
  }
}
