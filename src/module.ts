import { defineNuxtModule, createResolver, installModule } from "@nuxt/kit";

export default defineNuxtModule({
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // We can inject our CSS file which includes Tailwind's directives
    nuxt.options.css.push(resolver.resolve("./runtime/assets/styles.css"));

    await installModule("@nuxtjs/tailwindcss", {
      // module configuration
      exposeConfig: true,
      config: {
        darkMode: "class",
        content: {
          files: [
            resolver.resolve("./runtime/components/**/*.{vue,mjs,ts}"),
            resolver.resolve("./runtime/*.{mjs,js,ts}"),
          ],
        },
      },
    });
  },
});
