import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      body: [
        'Avenir',
        'Helvetica',
        'Helvetica',

      ]
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'underline',
            },
            h1: {
              fontWeight: '700',
              fontSize: theme('fontSize.3xl'),
            },
            img: {
              borderRadius: theme('borderRadius.lg'),
            },
            // …好きな要素をカスタマイズ…
          },
        },
        lg: {
          css: {
            h1: {
              fontSize: theme('fontSize.4xl'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    typography
  ],
};
export default config;
