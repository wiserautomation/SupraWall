// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// Root ESLint config — applies to all packages except the dashboard
// (which has its own Next.js-specific config at packages/dashboard/eslint.config.mjs)

import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    js.configs.recommended,
    {
        files: ["packages/!(dashboard)/**/*.ts", "plugins/**/*.ts"],
        ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            // TypeScript-specific
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

            // No console in library/server code (use logger instead)
            "no-console": ["warn", { allow: ["error"] }],

            // Basic correctness
            "no-undef": "off", // TypeScript handles this
            "no-unused-vars": "off", // Handled by @typescript-eslint/no-unused-vars
        },
    },
    {
        // CLI packages legitimately use console.log for user output
        files: ["packages/cli/**/*.ts"],
        rules: {
            "no-console": "off",
        },
    },
    {
        // Scripts (sync-stripe, migrations) legitimately use console.log for progress output
        files: ["packages/server/src/scripts/**/*.ts"],
        rules: {
            "no-console": "off",
        },
    },
];
