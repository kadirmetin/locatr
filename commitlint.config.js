module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "ci",
        "build",
        "revert",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      ["server", "web", "mobile", "shared", "deps", "config", "ci"],
    ],
    "references-empty": [0, "never"],
    "footer-max-line-length": [0, "always"],
    "body-max-line-length": [0, "always"],
  },
};
