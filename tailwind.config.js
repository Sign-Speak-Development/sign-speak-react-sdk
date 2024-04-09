/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      dropShadow: {
        'sign-speak': [
            '0 35px 35px #00AA9D',
            '0 45px 65px #00AA9D'
        ]
      },
      colors: {
        'sign-speak-teal': '#00AA9D',
        'sign-speak-grey': 'rgb(184, 184, 186)',
        'sign-speak-background-teal': 'rgb(230, 253, 252)',
        'sign-speak-background-teal-inv': 'rgb(25, 2, 3)',
        'success-green': '#00BA29',
        'fail-red': '#EB0202',
        'pref-green': '#029C54',
        'pref-orange': '#EB7700',
        'pref-red': '#D84646',
        'pref-blue': '#0084FF',
        'pref-black': '#000000',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif']
      },
    },
  },
  plugins: [],
  rootDir: "src",
  declarationMap: true
}