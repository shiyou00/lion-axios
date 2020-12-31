module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "babel-eslint",
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    strict: "off",
    "no-console": "off",
    "import/no-dynamic-require": "off",
    "global-require": "off",
    "require-yield": "off",
    "no-prototype-builtins": "off",
  },
};
