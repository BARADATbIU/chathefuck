module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": "error",
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
