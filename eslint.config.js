import antfu from '@antfu/eslint-config';

export default antfu(
  {
    vue: true,
    typescript: true,
    stylistic: {
      semi: true,
      quotes: 'single',
    },
  },
  {
    rules: {
      curly: ['error', 'all'],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/first-attribute-linebreak': [
        'error',
        {
          multiline: 'below',
          singleline: 'ignore',
        },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },
);
