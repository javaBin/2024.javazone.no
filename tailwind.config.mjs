import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
            fontFamily: {
                sans: ["JosefinSans-Light", "JosefinSans-SemiBold", "LimeLight-Regular", ...defaultTheme.fontFamily.sans]
            }
        },
	},
	plugins: [],
}
