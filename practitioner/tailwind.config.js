let colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      primary: colors.teal,
      secondary: colors.amber,
      success: colors.green,
      danger: colors.red,
      warning: colors.orange,
      info: colors.sky,
      light: colors.slate,
      dark: colors.stone,
    },
    extend: {
      minHeight: {
        base: '1rem',
      },
      colors: {
        white: '#fff',
        black: '#000',
      }
    },
  },
  plugins: [],
}
