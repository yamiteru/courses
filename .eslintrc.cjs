module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
};
