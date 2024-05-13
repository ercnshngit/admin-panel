import { text } from "stream/consumers";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          md: "1rem",
          lg: "1rem",
          xl: "2rem",
          "2xl": "5rem",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)"],
      },
      fontSize: {
        "5xl": ["3.125rem", "1"],
      },
      colors: {
        "primary-blue": "#002080",
        "secondary-blue": "#1d428a",
        "text-black": "#000000B3",
        "text-black-dark": "#000000E6",
        "icon-blue": "#407ec9",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          // this is for prose class
          css: {
            maxWidth: "100%",
            color: "#000000B3", // change global color scheme
            h1: {
              // mb-[0.5em] text-3xl font-bold leading-none text-secondary-blue lg:text-5xl
              color: "#1d428a",
              fontSize: "1.875rem",
              fontWeight: "700",
              lineHeight: "1.2",
              letterSpacing: "-0.02em",
              marginBottom: "0.5em",
              "@media (min-width: 1024px)": {
                fontSize: "2.5rem",
                lineHeight: "1.2",
              },
            },
            h2: {
              // mb-[1em] text-xl font-bold leading-none text-secondary-blue lg:text-2xl
              color: "#1d428a",
              fontSize: "1.5rem",
              fontWeight: "700",
              lineHeight: "1.3",
              marginBottom: "1em",
              "@media (min-width: 1024px)": {
                fontSize: "1.875rem",
                lineHeight: "1.2",
              },
            },
            p: {
              //mb-[1em] text-justify text-lg font-light text-text-black lg:text-xl w-full
              color: "#000000B3",
              fontSize: "1.125rem",
              fontWeight: "300",
              lineHeight: "1.5",
              marginBottom: "1em",
              textAlign: "justify",
              "@media (min-width: 1024px)": {
                fontSize: "1.25rem",
                lineHeight: "1.5",
              },
              ".ql-align-center": {
                backgroundColor: "red",
                textAlign: "center",
              },
              ".ql-align-justify": {
                textAlign: "justify",
              },
              ".ql-align-right": {
                textAlign: "right",
              },
            },
            strong: {
              color: "#1d428a",
              fontSize: "1.125rem",
              lineHeight: "1.5",

              fontWeight: "700",
              marginBottom: "0.5em",
              "@media (min-width: 1024px)": {
                fontSize: "1.25rem",
                lineHeight: "1.5",
              },
            },
            ul: {
              // ml-4
              marginLeft: "1rem",
              "> li": {
                color: "#000000B3",
                fontSize: "1.125rem",
                fontWeight: "300",
                lineHeight: "1.5",
                marginBottom: "1em",
                textAlign: "justify",
                "@media (min-width: 1024px)": {
                  fontSize: "1.25rem",
                  lineHeight: "1.5",
                },
                "> strong": {
                  color: "#1d428a",
                  fontSize: "1.125rem",
                  lineHeight: "1.5",

                  fontWeight: "700",
                  marginBottom: "0.5em",
                  "@media (min-width: 1024px)": {
                    fontSize: "1.25rem",
                    lineHeight: "1.5",
                  },
                },
              },
            },
            ol: {
              // ml-4
              marginLeft: "1rem",
              "> li": {
                color: "#000000B3",
                fontSize: "1.125rem",
                fontWeight: "300",
                lineHeight: "1.5",
                marginBottom: "1em",
                textAlign: "justify",
                "@media (min-width: 1024px)": {
                  fontSize: "1.25rem",
                  lineHeight: "1.5",
                },
                "> strong": {
                  color: "#1d428a",
                  fontSize: "1.125rem",
                  lineHeight: "1.5",

                  fontWeight: "700",
                  marginBottom: "0.5em",
                  "@media (min-width: 1024px)": {
                    fontSize: "1.25rem",
                    lineHeight: "1.5",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
