import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'darkgray': '#1a1a1a',
                'turquoise': '#00f3d2',
                'darkgreen': 'rgb(46, 107, 104)',
                'purple': '#6200A3',
            },
            animation: {
                sway: 'sway 3.5s ease-in-out infinite',
            },
            keyframes: {
                sway: {
                    '0%, 100%': {transform: 'translateX(0)'},
                    '50%': {transform: 'translateX(20px)'},
                },
            },
        },
    },
    plugins: [],
}
