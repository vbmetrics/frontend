// next.config.js
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.tsx',
  // opcjonalnie:
  // staticImage: true,
  // defaultShowCopyCode: true,
  // flexsearch: { codeblocks: false },
})

module.exports = withNextra({
  reactStrictMode: true,
  // jeśli masz własne rozszerzenia stron:
  // pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
})
