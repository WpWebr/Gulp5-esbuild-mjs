module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss'
  ],

  plugins: [
    'stylelint-order',
    'stylelint-selector-bem-pattern'
  ],

  rules: {
    /* =========================
       БАЗОВЫЕ ПРАВИЛА
    ========================== */

    'no-descending-specificity': null,
    'selector-max-id': 0,
    'selector-max-universal': 0,
    'selector-max-type': 0,

    /* =========================
       ПОРЯДОК СВОЙСТВ
    ========================== */

    'order/order': [
      'custom-properties',
      'declarations'
    ],

    'order/properties-order': [
      [
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',

        'display',
        'flex',
        'flex-direction',
        'flex-wrap',
        'align-items',
        'justify-content',
        'gap',

        'width',
        'height',
        'max-width',
        'min-width',
        'max-height',
        'min-height',

        'margin',
        'padding',

        'font',
        'font-size',
        'font-weight',
        'line-height',
        'text-align',
        'color',

        'background',
        'border',
        'border-radius',

        'opacity',
        'transition',
        'transform'
      ],
      { unspecified: 'bottom' }
    ],

    /* =========================
       БЭМ (КРИТИЧНО)
    ========================== */

    'plugin/selector-bem-pattern': {
      preset: 'bem',
      componentName: '[a-z]+(?:-[a-z]+)*',
      componentSelectors: {
        initial: '^\\.{{componentName}}$',
        combined: '^\\.{{componentName}}(__[a-z]+(?:-[a-z]+)*)?(--[a-z]+(?:-[a-z]+)*)?$'
      }
    },

    /* =========================
       SCSS
    ========================== */

    'scss/at-import-no-partial-leading-underscore': null,
    'scss/at-import-partial-extension': null,
    'scss/no-global-function-names': null
  }
};
