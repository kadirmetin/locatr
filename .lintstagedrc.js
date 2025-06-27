module.exports = {
  "apps/server/**/*.{js,ts}": ["eslint --fix", "prettier --write"],
  "apps/web/**/*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
  "apps/mobile/**/*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
};
