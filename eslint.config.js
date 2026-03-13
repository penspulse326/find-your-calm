import antfu from '@antfu/eslint-config';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';

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
  {
    // enable all recommended rules
    extends: [eslintPluginBetterTailwindcss.configs.recommended],

    // if needed, override rules to configure them individually
    rules: {
      'better-tailwindcss/no-unknown-classes': [
        'error',
        {
          detectComponentClasses: true,
          ignore: ['text-shadow-custom', 'animate-shimmer', 'animate-fade-in'],
        },
      ],
    },

    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/style.css',
        tailwindConfig: 'tailwind.config.js',
      },
    },

    files: ['**/*.vue'],
  },
);
