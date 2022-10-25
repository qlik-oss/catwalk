module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'airbnb',
    'plugin:promise/recommended',
    'plugin:cypress/recommended',
  ],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'react/forbid-prop-types': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-autofocus': 0,
    'import/no-named-as-default': 0,
    'max-len': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: [
          'arrow-function',
          'function-declaration',
          'function-expression',
        ],
        unnamedComponents: ['arrow-function', 'function-expression'],
      },
    ],
  },
  plugins: ['promise'],
};
