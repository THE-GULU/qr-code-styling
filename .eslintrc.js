module.exports = {
  env: {
    node: true
  },
  parser:  '@typescript-eslint/parser',
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off"
  },
  parserOptions: {
    sourceType: "module"
  }
};
