import { defineNuxtPlugin } from "#app";
import EmojiPicker from "./components/EmojiPicker.vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("EmojiPicker", EmojiPicker);
});
