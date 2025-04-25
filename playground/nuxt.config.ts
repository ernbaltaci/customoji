export default defineNuxtConfig({
  modules: ["../src/module"],
  devtools: { enabled: true },
  compatibilityDate: "2025-04-25",
  css: ["../src/runtime/assets/styles.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
