/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                kodchasan: ['Kodchasan', 'sans-serif'],
                italianno: ['Italianno', 'cursive'],
                montserrat: ['Montserrat', 'sans-serif'],
                lilitaOne: ["Lilita One", 'sans-serif'],
                alfaSlabOne: ["Alfa Slab One", 'cursive'],
            },
            backgroundImage: {
                'grad-pattern': "url('./assets/img/background.svg')",
            },
        },
    },
    plugins: [],
};
