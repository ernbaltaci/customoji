<script setup lang="ts">
import {
  ref,
  computed,
  withDefaults,
  defineProps,
  defineEmits,
  onMounted,
  nextTick,
} from "vue";
import { emojiList } from "../data/emojis";

interface CustomEmoji {
  name: string;
  url?: string;
  base64?: string;
  category?: string;
  emoji?: string;
  description?: string;
  keywords?: string[];
}

interface CustomCategory {
  name: string;
  icon: string;
  emojis: CustomEmoji[];
}

interface ThemeColors {
  background: string;
  text: string;
  secondaryText: string;
  border: string;
  hover: string;
  active: string;
  input: string;
  scrollbar: string;
}

interface Props {
  customEmojis?: CustomEmoji[];
  customCategories?: CustomCategory[];
  columns?: number;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showCloseButton?: boolean;
  theme?: "light" | "dark" | "system";
  customTheme?: Partial<ThemeColors>;
  frequentlyUsed?: string[];
  maxFrequentlyUsed?: number;
  showFrequentlyUsed?: boolean;
  categoryIcons?: { [key: string]: string };
  customClass?: string;
  frequentlyUsedTitle?: string;
  categoryTitles?: { [key: string]: string };
}

const props = withDefaults(defineProps<Props>(), {
  customEmojis: () => [],
  customCategories: () => [],
  columns: 8,
  searchPlaceholder: "Search emojis...",
  showSearch: true,
  showCloseButton: true,
  theme: "system",
  customTheme: () => ({}),
  frequentlyUsed: () => [],
  maxFrequentlyUsed: 16,
  showFrequentlyUsed: true,
  categoryIcons: () => ({
    "Smileys & People": "😊",
    "Animals & Nature": "🐻",
    "Food & Drink": "🍔",
    Activities: "⚽",
    "Travel & Places": "✈️",
    Objects: "💡",
    Symbols: "❤️",
    Flags: "🏁",
  }),
  customClass: "",
  frequentlyUsedTitle: "FREQUENTLY USED",
  categoryTitles: () => ({}),
});

// Default category icons as a fallback
const defaultCategoryIcons = {
  "Smileys & People": "😊",
  "Animals & Nature": "🐻",
  "Food & Drink": "🍔",
  Activities: "⚽",
  "Travel & Places": "✈️",
  Objects: "💡",
  Symbols: "❤️",
  Flags: "🏁",
  Discord: "🎮",
  Social: "🌐",
  Custom: "🔧",
};

const emit = defineEmits<{
  (e: "select", emoji: { emoji: string; name: string; category: string }): void;
  (e: "close"): void;
  (e: "frequentlyUsedUpdate", emojis: string[]): void;
}>();

const searchQuery = ref("");
const selectedCategory = ref("");
const isInitialized = ref(false);

// Theme management
const systemTheme = computed(() =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
);

const currentTheme = computed(() =>
  props.theme === "system" ? systemTheme.value : props.theme
);

const themeColors = computed(() => {
  const baseColors: ThemeColors =
    currentTheme.value === "dark"
      ? {
          background: "rgba(58, 58, 60, 0.95)",
          text: "#ffffff",
          secondaryText: "rgba(235, 235, 245, 0.6)",
          border: "rgba(235, 235, 245, 0.1)",
          hover: "rgba(120, 120, 128, 0.2)",
          active: "#007AFF",
          input: "rgba(120, 120, 128, 0.2)",
          scrollbar: "rgba(235, 235, 245, 0.3)",
        }
      : {
          background: "#ffffff",
          text: "#000000",
          secondaryText: "#8e8e93",
          border: "#e5e7eb",
          hover: "#f1f3f5",
          active: "#007AFF",
          input: "#f1f3f5",
          scrollbar: "#c7c7cc",
        };

  return { ...baseColors, ...props.customTheme };
});

// Combine default emoji list with custom categories
const allCategories = computed(() => {
  const categories = { ...emojiList };

  // Add custom categories
  props.customCategories.forEach((category: CustomCategory) => {
    categories[category.name] = category.emojis.map((emoji: CustomEmoji) => ({
      emoji: emoji.emoji || emoji.url || "",
      description: emoji.name,
      keywords: emoji.keywords || [emoji.name],
      code: `custom-${emoji.name}`,
      no: 9999, // Place at the end
      flagged: false,
    }));
  });

  return categories;
});

// Initialize selectedCategory with the first available category
const initializeSelectedCategory = () => {
  const availableCategories = Object.keys(allCategories.value);
  if (availableCategories.length > 0) {
    selectedCategory.value = availableCategories[0];
  }
};

// Initialize component
onMounted(async () => {
  // Wait for the next tick to ensure the component is fully rendered
  await nextTick();

  // Initialize the selected category
  initializeSelectedCategory();

  // Mark as initialized
  isInitialized.value = true;
});

const filteredEmojis = computed(() => {
  if (!selectedCategory.value) return [];

  const category = allCategories.value[selectedCategory.value];
  if (!category) return [];

  if (!searchQuery.value) return category;

  return category.filter(
    (emoji: any) =>
      emoji.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      emoji.keywords.some((keyword: string) =>
        keyword.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
  );
});

const handleEmojiSelect = (emoji: any) => {
  const emojiData = {
    emoji: emoji.emoji,
    name: emoji.description,
    category: selectedCategory.value,
  };

  // Update frequently used
  if (props.showFrequentlyUsed) {
    const newFrequentlyUsed = [emoji.emoji, ...props.frequentlyUsed]
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, props.maxFrequentlyUsed);

    emit("frequentlyUsedUpdate", newFrequentlyUsed);
  }

  emit("select", emojiData);
};

const handleClose = () => {
  emit("close");
};

// Dynamic styles based on theme
const styles = computed(() => ({
  picker: {
    backgroundColor: themeColors.value.background,
    color: themeColors.value.text,
  },
  input: {
    backgroundColor: themeColors.value.input,
    color: themeColors.value.text,
  },
  button: {
    color: themeColors.value.text,
    "&:hover": {
      backgroundColor: themeColors.value.hover,
    },
  },
}));

const gridStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
  gap: "4px",
}));

// Helper function to get category title
const getCategoryTitle = (category: string) => {
  return props.categoryTitles[category] || category.toUpperCase();
};

// Get all available categories including custom ones
const availableCategories = computed(() => {
  return Object.keys(allCategories.value);
});
</script>

<template>
  <div
    v-if="isInitialized"
    class="emoji-picker"
    :style="styles.picker"
    :class="[customClass]"
  >
    <!-- Close Button -->
    <button v-if="showCloseButton" class="close-button" @click="handleClose">
      ×
    </button>

    <!-- Search Bar -->
    <div v-if="showSearch" class="search-container">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          :style="styles.input"
        />
      </div>
    </div>

    <!-- Frequently Used Section -->
    <div
      v-if="showFrequentlyUsed && frequentlyUsed.length > 0"
      class="frequently-used"
    >
      <h3 class="section-title" :style="{ color: themeColors.secondaryText }">
        {{ frequentlyUsedTitle }}
      </h3>
      <div class="emoji-grid frequently-used-grid">
        <button
          v-for="emoji in frequentlyUsed"
          :key="emoji"
          @click="handleEmojiSelect({ emoji, description: emoji })"
          class="emoji-button"
          :style="styles.button"
        >
          <img
            v-if="emoji.startsWith('http')"
            :src="emoji"
            :alt="emoji"
            class="custom-emoji-img"
          />
          <span v-else>{{ emoji }}</span>
        </button>
      </div>
    </div>

    <!-- Main Emoji Section -->
    <div v-if="selectedCategory" class="main-section">
      <h3 class="section-title" :style="{ color: themeColors.secondaryText }">
        {{ getCategoryTitle(selectedCategory) }}
      </h3>
      <div :style="gridStyle" class="emoji-grid">
        <button
          v-for="emoji in filteredEmojis"
          :key="emoji.code"
          @click="handleEmojiSelect(emoji)"
          class="emoji-button"
          :style="styles.button"
        >
          <img
            v-if="emoji.emoji.startsWith('http')"
            :src="emoji.emoji"
            :alt="emoji.description"
            class="custom-emoji-img"
          />
          <span v-else>{{ emoji.emoji }}</span>
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div
      v-if="availableCategories.length > 0"
      class="bottom-nav"
      :style="{ backgroundColor: themeColors.background }"
    >
      <button
        v-for="category in availableCategories"
        :key="category"
        @click="selectedCategory = category"
        class="nav-button"
        :class="{ 'nav-button--active': selectedCategory === category }"
        :style="{
          color:
            selectedCategory === category
              ? themeColors.active
              : themeColors.secondaryText,
        }"
      >
        <span class="nav-icon">{{
          categoryIcons[category] || defaultCategoryIcons[category]
        }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  padding: 1rem;
  max-width: 320px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  position: relative;
}

.close-button {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 12px;
  height: 12px;
  text-align: center;
  font-size: 12px;
  border-radius: 12px;
  background-color: rgba(120, 120, 128, 0.3);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-container {
  margin: 0.5rem 0 1rem;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  font-size: 12px;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-left: 4px;
}

.frequently-used {
  margin-bottom: 1rem;
}

.frequently-used-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  /* Hide scrollbar for IE/Edge */
  -ms-overflow-style: none;
}

/* Hide scrollbar for Chrome/Safari/Opera */
.frequently-used-grid::-webkit-scrollbar {
  display: none;
}

.main-section {
  margin-bottom: 48px;
}

.emoji-grid {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  /* Hide scrollbar for IE/Edge */
  -ms-overflow-style: none;
}

/* Hide scrollbar for Chrome/Safari/Opera */
.emoji-grid::-webkit-scrollbar {
  display: none;
}

.emoji-button {
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 8px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.nav-button {
  padding: 6px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-icon {
  font-size: 16px;
}

.custom-emoji-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  vertical-align: middle;
}

@media (max-width: 640px) {
  .emoji-picker {
    max-width: 100%;
    border-radius: 12px 12px 0 0;
  }

  .emoji-button {
    font-size: 18px;
  }
}
</style>
