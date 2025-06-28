module.exports = {
  // Web app (Next.js)
  "web/**/*.{js,ts,tsx}": [
    "yarn workspace web eslint --fix",
    "yarn workspace web prettier --write",
    "yarn workspace web tsc --noEmit",
  ],

  "web/**/*.{json,md,yml,yaml}": ["yarn workspace web prettier --write"],

  // Mobile app (React Native/Expo)
  "mobile/**/*.{js,ts,tsx}": [
    "yarn workspace mobile eslint --fix",
    "yarn workspace mobile tsc --noEmit",
  ],

  "mobile/**/*.{json,md,yml,yaml}": ["yarn workspace mobile prettier --write"],

  // Server app (Node.js/Express)
  "server/**/*.{js,ts}": [
    "yarn workspace server eslint --fix",
    "yarn workspace server prettier --write",
    "yarn workspace server tsc --noEmit",
  ],

  "server/**/*.{json,md,yml,yaml}": ["yarn workspace server prettier --write"],
};
