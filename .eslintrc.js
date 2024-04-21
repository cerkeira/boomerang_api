module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: 'off',
    'no-console': 'off',
    indent: 'off',
    'import/order': 'off',
    'no-multiple-empty-lines': 'off',
    'linebreak-style': 'off',
    'comma-dangle': 'off',
  },
};
