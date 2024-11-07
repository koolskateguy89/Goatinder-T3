// @ts-check

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

// TODO: ts ignore & check actual type
import a from "eslint-config-next";

// @ts-expect-error No types
import airbnb from "eslint-config-airbnb";
// @ts-expect-error No types
import airbnbTypescript from "eslint-config-airbnb-typescript";

// TODO: add airbnb, next core web vitals

export default tseslint.config(
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/return-await": "off",
      "@typescript-eslint/require-await": "off", // really annoying during development

      // my own rules
      "no-duplicate-imports": "error",
      "@typescript-eslint/consistent-type-imports": "warn",

      // TODO
    },
  },
);
