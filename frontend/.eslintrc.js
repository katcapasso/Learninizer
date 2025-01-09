module.exports = {
    env: {
      browser: true,  // Enable browser globals like window, document, etc.
      es2021: true,   // Allow ES2021 features (you can modify it if using other versions)
      node: true,     // Enable Node.js globals (if needed in backend or development)
    },
    extends: [
      "eslint:recommended",       // Use recommended ESLint rules
      "plugin:react/recommended", // Use the recommended React rules
      "plugin:react/jsx-runtime"  // Enable JSX support for React 17 and higher
    ],
    parserOptions: {
      ecmaVersion: 12,       // Allows ECMAScript 2021 syntax
      sourceType: "module",  // Allow ECMAScript modules like import/export
    },
    plugins: ["react"],  // Include the React plugin for linting React code
    rules: {
      "no-unused-vars": "warn",           // Warn for unused variables
      "no-console": "warn",               // Warn for console statements (can be changed to 'off')
      "react/prop-types": "off",          // Disable prop-types checking (can be changed if using prop-types)
      "react/jsx-uses-react": "off",      // React 17+ does not require importing React for JSX
      "react/jsx-uses-vars": "warn",     // Warn about variables that are used but not declared
      "react/react-in-jsx-scope": "off", // Disable react in scope check for React 17+
      "no-magic-numbers": ["warn", {     // Warn for magic numbers
        "ignore": [0, 1]                 // Allow 0 and 1 as magic numbers (adjust as needed)
      }],
      "no-undef": "warn",                 // Warn for undefined variables (useful in Node.js or mixed environments)
      "react/jsx-pascal-case": "warn",    // Enforce PascalCase for React component names
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version in your project
      },
    },
  };
  