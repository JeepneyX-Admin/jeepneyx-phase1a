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

window.tailwind = window.tailwind || {};
window.tailwind.config = {
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
