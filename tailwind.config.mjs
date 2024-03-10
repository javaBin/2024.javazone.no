import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        fontFamily: {
            sans: ["JosefinSans-Light", "JosefinSans-SemiBold", "LimeLight-Regular", ...defaultTheme.fontFamily.sans]
        },
        fontSize: {
            xs: "var(--step--2)",
            sm: "var(--step--1)",
            base: "var(--step-0)",
            lg: "var(--step-1)",
            xl: "var(--step-2)",
            "2xl": "var(--step-3)",
            "3xl": "var(--step-4)",
            "4xl": "var(--step-5)",
            "5xl": "var(--step-6)",
        },
        extend: {
            colors: {
                'darkgray': '#1a1a1a',
                'turquoise': '#00f3d2',
                'darkgreen': 'rgb(46, 107, 104)'
            },
        }
    },
    plugins: [],
}
