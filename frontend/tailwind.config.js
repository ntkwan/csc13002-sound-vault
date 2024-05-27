/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                kodchasan: ['Kodchasan', 'sans-serif'],
                italianno: ['Italianno', 'cursive'],
                montserrat: ['Montserrat', 'sans-serif'],
            },
            backgroundImage: {
                'grad-pattern': "url('./assets/img/background.svg')",
            },
        },
    },
    plugins: [],
};
