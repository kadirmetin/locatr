module.exports = {
  // Web app (Next.js)
  "apps/web/**/*.{js,ts,tsx}": [
    "yarn workspace web eslint --fix",
    "yarn workspace web prettier --write",
    "yarn workspace web tsc --noEmit",
  ],

  "apps/web/**/*.{json,md,yml,yaml}": ["yarn workspace web prettier --write"],

  // Mobile app (React Native/Expo)
  "apps/mobile/**/*.{js,ts,tsx}": [
    "yarn workspace mobile eslint --fix",
    "yarn workspace mobile tsc --noEmit",
  ],

  "apps/mobile/**/*.{json,md,yml,yaml}": [
    "yarn workspace mobile prettier --write",
  ],

  // Server app (Node.js/Express)
  "apps/server/**/*.{js,ts}": [
    "yarn workspace server eslint --fix",
    "yarn workspace server prettier --write",
    "yarn workspace server tsc --noEmit",
  ],

  "apps/server/**/*.{json,md,yml,yaml}": [
    "yarn workspace server prettier --write",
  ],
};
