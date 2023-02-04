/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#222',
				bg: '#F5F5F5',
				accent: '#0E9CD5'
			}
		}
	},
	plugins: [require('daisyui')]
};
