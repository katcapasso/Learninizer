module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",            // Basic linting rules
    "plugin:react/recommended",      // React specific linting rules
    "plugin:react/jsx-runtime",      // JSX runtime support for React 17+
  ],
  parserOptions: {
    ecmaVersion: 12,                 // ECMAScript 2021 syntax support
    sourceType: "module",            // Enable ES6 module support
  },
  plugins: ["react"],                // React plugin for JSX and React specific linting
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warn for unused vars, except those starting with '_'
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off", // Warn for console in production only
    "react/prop-types": "off",       // Disable prop-types checking
    "react/jsx-uses-react": "off",   // React 17+ does not require 'React' to be in scope
    "react/jsx-uses-vars": "warn",  // Warn for used vars in JSX (for better linting)
    "react/react-in-jsx-scope": "off", // React in scope is not needed for React 17+
    "no-magic-numbers": ["warn", { "ignore": [0, 1] }], // Allow magic numbers 0 and 1
    "no-undef": "warn",             // Warn for undefined variables
    "react/jsx-pascal-case": "warn", // Enforce PascalCase for React component names
  },
  settings: {
    react: {
      version: "detect",             // Automatically detect the React version in your project
    },
  },
};
