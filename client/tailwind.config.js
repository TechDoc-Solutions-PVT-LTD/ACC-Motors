/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "375": "375px",
        "430": "430px",
        ms: "400px",
        xs: "490px",
        mdd: "850px",
        "3xl": "2560px",
        "4xl": "3840px",
        xxl: "1628px",
        fxl: "1920px",
        x2xl: "1628px",
      },
    },
  },
  plugins: [],
}

