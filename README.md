# Customoji

A customizable emoji picker component for Vue 3 and Nuxt 3. Built with TypeScript and Tailwind CSS.

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![license][license-src]][license-href]

## Features

- 🎯 Display standard Unicode emojis grouped by categories
- 🎨 Support for custom emojis (URL or base64)
- 🔍 Built-in search functionality
- 🎮 Fully customizable via props and slots
- 📱 Mobile responsive
- 🎨 Theme support (light, dark, system)
- 💪 TypeScript support

## Installation

```bash
npm install customoji
# or
yarn add customoji
```

## Usage

### Basic Usage

```vue
<template>
  <EmojiPicker @select="handleEmojiSelect" />
</template>

<script setup>
import { EmojiPicker } from "customoji";

const handleEmojiSelect = (emoji) => {
  console.log("Selected emoji:", emoji);
};
</script>
```

### With Custom Emojis

```vue
<template>
  <EmojiPicker
    :custom-emojis="customEmojis"
    :columns="8"
    @select="handleEmojiSelect"
  />
</template>

<script setup>
import { EmojiPicker } from "customoji";

const customEmojis = [
  {
    name: "Custom Heart",
    url: "https://example.com/heart.png",
  },
  {
    name: "Custom Star",
    base64: "data:image/png;base64,...",
  },
];

const handleEmojiSelect = (emoji) => {
  console.log("Selected emoji:", emoji);
};
</script>
```

### With Theme Support

```vue
<template>
  <EmojiPicker
    theme="dark"
    :custom-theme="customTheme"
    @select="handleEmojiSelect"
  />
</template>

<script setup>
import { EmojiPicker } from "customoji";

const customTheme = {
  background: "rgba(30, 30, 30, 0.95)",
  text: "#ffffff",
  active: "#ff4081",
};

const handleEmojiSelect = (emoji) => {
  console.log("Selected emoji:", emoji);
};
</script>
```

### With Frequently Used Emojis

```vue
<template>
  <EmojiPicker
    :frequently-used="frequentlyUsed"
    :max-frequently-used="16"
    @select="handleEmojiSelect"
    @frequently-used-update="updateFrequentlyUsed"
  />
</template>

<script setup>
import { ref } from "vue";
import { EmojiPicker } from "customoji";

const frequentlyUsed = ref(["😊", "❤️", "👍"]);

const handleEmojiSelect = (emoji) => {
  console.log("Selected emoji:", emoji);
};

const updateFrequentlyUsed = (newFrequentlyUsed) => {
  frequentlyUsed.value = newFrequentlyUsed;
};
</script>
```

### With Custom Emojis and Categories

```vue
<template>
  <div class="relative">
    <input
      v-model="selectedEmoji"
      @click="showEmojiPicker = !showEmojiPicker"
      class="w-full p-2 border border-gray-300 rounded-md"
      type="text"
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
</template>

<script setup>
import { ref } from "vue";
import { EmojiPicker } from "customoji";

const selectedEmoji = ref("");
const showEmojiPicker = ref(false);
const frequentlyUsedEmojis = ref([]);
const selectedEmojiData = ref(null);

// Define custom categories with their emojis
const customCategories = ref([
  {
    name: "Discord",
    icon: "🎮",
    emojis: [
      {
        url: "https://example.com/discord.png",
        name: "discord",
      },
      {
        url: "https://example.com/discord-nitro.png",
        name: "discord nitro",
      },
    ],
  },
  {
    name: "Social",
    icon: "🌐",
    emojis: [
      {
        url: "https://example.com/github.png",
        name: "github",
      },
      {
        url: "https://example.com/twitter.png",
        name: "twitter",
      },
    ],
  },
]);

const handleEmojiSelect = (emoji) => {
  selectedEmoji.value = emoji.emoji;
  selectedEmojiData.value = emoji;
  frequentlyUsedEmojis.value = [emoji.emoji, ...frequentlyUsedEmojis.value];
};
</script>
```

The component supports two ways of adding custom emojis:

1. **Custom Categories**: You can define custom categories with their own emojis. Each category can have:

   - `name`: The category name
   - `icon`: An emoji icon representing the category
   - `emojis`: Array of custom emojis in this category

2. **Custom Emoji Structure**: Each custom emoji can have:
   - `name`: The name of the emoji
   - `url`: URL to the emoji image
   - `category`: The category it belongs to (optional)

When a custom emoji is selected:

- The emoji URL is stored in the input field
- If the emoji is a custom emoji (URL-based), its image is displayed on the right side of the input field
- The emoji is added to the frequently used list

## Props

| Prop                  | Type      | Default              | Description                                                     |
| --------------------- | --------- | -------------------- | --------------------------------------------------------------- |
| `customEmojis`        | `Array`   | `[]`                 | Array of custom emoji objects with `name` and `url` or `base64` |
| `columns`             | `number`  | `8`                  | Number of columns in the emoji grid                             |
| `searchPlaceholder`   | `string`  | `'Search emojis...'` | Placeholder text for the search input                           |
| `showSearch`          | `boolean` | `true`               | Whether to show the search input                                |
| `showCloseButton`     | `boolean` | `true`               | Whether to show the close button                                |
| `theme`               | `string`  | `'system'`           | Theme to use: 'light', 'dark', or 'system'                      |
| `customTheme`         | `Object`  | `{}`                 | Custom theme colors to override default theme                   |
| `frequentlyUsed`      | `Array`   | `[]`                 | Array of frequently used emoji codes                            |
| `maxFrequentlyUsed`   | `number`  | `16`                 | Maximum number of frequently used emojis to display             |
| `showFrequentlyUsed`  | `boolean` | `true`               | Whether to show the frequently used section                     |
| `categoryIcons`       | `Object`  | `{}`                 | Custom icons for category tabs                                  |
| `customClass`         | `string`  | `''`                 | Additional CSS classes to apply to the picker                   |
| `frequentlyUsedTitle` | `string`  | `'FREQUENTLY USED'`  | Title for the frequently used section                           |
| `categoryTitles`      | `Object`  | `{}`                 | Custom titles for category sections                             |

## Events

| Event                  | Payload                                             | Description                                     |
| ---------------------- | --------------------------------------------------- | ----------------------------------------------- |
| `select`               | `{ emoji: string, name: string, category: string }` | Emitted when an emoji is selected               |
| `close`                | -                                                   | Emitted when the close button is clicked        |
| `frequentlyUsedUpdate` | `string[]`                                          | Emitted when frequently used emojis are updated |

## Slots

| Slot    | Props               | Description                              |
| ------- | ------------------- | ---------------------------------------- |
| `emoji` | `{ emoji: Object }` | Custom template for rendering each emoji |

## Theme Customization

The component supports three themes: light, dark, and system (which follows the user's system preference). You can customize the theme colors by passing a `customTheme` object with the following properties:

```typescript
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
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

That's it! You can now use My Module in your Nuxt app ✨

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/customoji/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/customoji
[npm-downloads-src]: https://img.shields.io/npm/dm/customoji.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/customoji
[license-src]: https://img.shields.io/npm/l/customoji.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/customoji
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
