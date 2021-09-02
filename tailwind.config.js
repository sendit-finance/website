module.exports = {
  important: true, // Remove when https://github.com/tailwindlabs/tailwindcss-typography/issues/32 has a solution.
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  purge: ['./src/**/*.js', './src/**/*.jsx', './pages/**/*.js'],
  variants: {
    // https://tailwindcss.com/docs/configuring-variants
    // This allows us to use the "disabled" css class names prefix to only
    // apply the class when the input is disabled. Ex: `disabled:text-sm`
    extend: {
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      cursor: ['disabled']
    }
  },
  theme: {
    extend: {
      colors: {
        pink: {
          600: '#EC3A6D'
        },
        gray: {
          600: '#373738',
          700: '#161c21',
          900: '#0f1218'
        },
        green: {
          200: '#A7F3D0',
          300: '#51FFAA',
          400: '#8EFFC8'
        },
        yellow: {
          300: '#FCD34D'
        }
      },
      backgroundImage: (theme) => ({
        'hero-pattern': "url('/assets/img/background-grey.svg')"
      }),
      maxWidth: {
        prose: '65ch'
      }
    }
  }
}
