<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import EmojiPicker from "../src/components/EmojiPicker.vue";

const selectedEmoji = ref("");
const showEmojiPicker = ref(false);
const frequentlyUsedEmojis = ref([]);
const selectedEmojiData = ref<{
  emoji: string;
  name: string;
  category: string;
} | null>(null);

// Custom categories
const customCategories = ref([
  {
    name: "Discord",
    icon: "🎮",
    emojis: [
      {
        url: "https://static.vecteezy.com/system/resources/previews/018/930/718/non_2x/discord-logo-discord-icon-transparent-free-png.png",
        name: "discord",
      },
      {
        url: "https://cdn-icons-png.flaticon.com/512/3670/3670157.png",
        name: "discord nitro",
      },
    ],
  },
  {
    name: "Social",
    icon: "🌐",
    emojis: [
      {
        url: "https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/github-512.png",
        name: "github",
      },
      {
        url: "https://cdn-icons-png.flaticon.com/512/3670/3670151.png",
        name: "twitter",
      },
    ],
  },
]);

// Initialize the component
onMounted(async () => {
  // Wait for the next tick to ensure the component is fully rendered
  await nextTick();

  // Make sure custom categories are properly initialized
  if (customCategories.value.length > 0) {
    console.log("Custom categories initialized:", customCategories.value);
  }
});

const handleEmojiSelect = (emoji: {
  emoji: string;
  name: string;
  category: string;
}) => {
  selectedEmoji.value = emoji.emoji;
  selectedEmojiData.value = emoji;
  console.log("Selected emoji:", emoji);
};
</script>

<template>
  <div class="p-4 bg-gray-300 h-screen">
    <div class="relative">
      <input
        class="w-full p-2 border border-gray-300 rounded-md"
        type="text"
        v-model="selectedEmoji"
        @click="showEmojiPicker = !showEmojiPicker"
      />
      <img
        v-if="selectedEmojiData && selectedEmojiData.emoji.startsWith('http')"
        :src="selectedEmojiData.emoji"
        :alt="selectedEmojiData.name"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 object-contain"
      />
    </div>

    <EmojiPicker
      v-if="showEmojiPicker"
      :custom-categories="customCategories"
      :frequently-used="frequentlyUsedEmojis"
      @select="handleEmojiSelect"
      @close="showEmojiPicker = false"
      @frequently-used-update="frequentlyUsedEmojis = $event"
    />
  </div>
</template>
