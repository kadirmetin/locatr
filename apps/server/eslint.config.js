const globals = require("globals");
const js = require("@eslint/js");
const prettierConfig = require("eslint-plugin-prettier/recommended");
const tsEslint = require("typescript-eslint");

module.exports = [
  js.configs.recommended,

  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,

  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
  },

  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  prettierConfig,

  {
    ignores: ["dist/", "node_modules/", "eslint.config.js"],
  },
];
