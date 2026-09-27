export interface FontOptions {
  weight?: string | string[] | number | number[];
  style?: string | string[];
  subsets?: string[];
  display?: string;
  variable?: string;
  fallback?: string[];
  adjustFontFallback?: boolean;
  preload?: boolean;
}

export interface NextFontWithVariable {
  className: string;
  variable: string;
  style: {
    fontFamily: string;
    fontWeight?: number | string;
    fontStyle?: string;
  };
}

function createFont(
  family: string,
  defaultVar: string,
  fallback: string,
  defaultClass: string
) {
  return function fontLoader(options?: FontOptions): NextFontWithVariable {
    const varName = options?.variable || defaultVar;
    const fontFamilyStr = `var(${varName}, "${family}", ${fallback})`;

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (!root.style.getPropertyValue(varName)) {
        root.style.setProperty(varName, `"${family}", ${fallback}`);
      }
    }

    return {
      className: defaultClass,
      variable: varName,
      style: {
        fontFamily: fontFamilyStr,
        ...(options?.weight ? { fontWeight: Array.isArray(options.weight) ? options.weight[0] : options.weight } : {}),
        ...(options?.style ? { fontStyle: Array.isArray(options.style) ? options.style[0] : options.style } : {}),
      },
    };
  };
}

export const Geist = createFont(
  'Geist',
  '--font-geist-sans',
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'font-geist'
);

export const Geist_Mono = createFont(
  'Geist Mono',
  '--font-geist-mono',
  'ui-monospace, SFMono-Regular, Roboto Mono, Menlo, monospace',
  'font-geist-mono'
);

export const Geist_Pixel = createFont(
  'Geist Pixel',
  '--font-geist-pixel',
  'monospace, sans-serif',
  'font-geist-pixel'
);

export const GeistSans = Geist;
export const GeistMono = Geist_Mono;
export const GeistPixel = Geist_Pixel;

export default {
  Geist,
  Geist_Mono,
  Geist_Pixel,
  GeistSans,
  GeistMono,
  GeistPixel,
};
