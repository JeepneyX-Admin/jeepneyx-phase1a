// Centralized Tailwind theme config shared across all pages.
const fallbackBrandTokens = {
  primary: "#39FF14",
  primaryHover: "#30D911",
  textOnLight: "#1e7a00"
};

const brandTokens =
  window.JeepneyXThemeTokens && window.JeepneyXThemeTokens.brand
    ? window.JeepneyXThemeTokens.brand
    : fallbackBrandTokens;

const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          700: brandTokens.primary,
          800: brandTokens.primaryHover,
          900: brandTokens.textOnLight
        }
      }
    }
  }
};

// Expose config in both forms Tailwind CDN checks across versions.
var tailwind = window.tailwind || {};
tailwind.config = tailwindConfig;
window.tailwind = tailwind;
