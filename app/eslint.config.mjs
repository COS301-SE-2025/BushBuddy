import js from "@eslint/js";
import expoConfig from "eslint-config-expo/flat"; // Add Expo support
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Base JavaScript rules
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  // Browser globals for PWA, with React Native compatibility
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    languageOptions: { 
      globals: { 
        ...globals.browser, 
        __DEV__: "readonly", // React Native global
      },
    },
  },
  // TypeScript rules
  tseslint.configs.recommended,
  // React rules
  pluginReact.configs.flat.recommended,
  // Expo-specific rules
  expoConfig,
  // Custom rules and ignores
  {
    rules: {
      'no-unused-vars': 'warn',
      'react/prop-types': 'off', // Disable if using TypeScript types
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'no-undef': ['error', { 'typeof': true }], // Allow typeof checks for undefined globals
    },
    ignores: ['node_modules/', 'dist/'],
  },
]);