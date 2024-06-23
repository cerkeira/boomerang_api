module.exports = {
    env: {
        node: true,
        es6: true,
    },
    extends: ['airbnb-base'],
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
        'import/newline-after-import': 'off',
        'comma-dangle': 'off',
        'func-call-spacing': 'off',
        'no-spaced-func': 'off',
        camelcase: 'off',
        'no-trailing-spaces': 'off',
        'object-shorthand': 'off',
        'consistent-return': 'off',
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
        'object-curly-newline': 'off',
        'operator-linebreak': 'off',
        'func-names': 'off',
        'no-unused-vars': 'off',
        'import/no-unresolved': 'off',
        'array-callback-return': 'off',
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
        'no-plusplus': 'off',
        'no-param-reassign': 'off',
        'no-unused-expressions': 'off',
        'import/extensions': 'off',
    },
    ignorePatterns: ['migrations/', 'seeders/'],
};
