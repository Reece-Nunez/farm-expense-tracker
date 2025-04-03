export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          100: '#f3e5e1',
          200: '#e5cfc5',
          300: '#d7b9a9',
          400: '#caa38c',
          500: '#bc8d70',
          600: '#9a715a',
          700: '#785544',
          800: '#55392e',
          900: '#331d18',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
