/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                kodchasan: ['Kodchasan', 'sans-serif'],
                italianno: ['Italianno', 'cursive'],
                montserrat: ['Montserrat', 'sans-serif'],
                lilitaone: ['Lilita One', 'cursive'],
                inter: ['Inter', 'sans-serif'],
                arimo: ['Arimo', 'sans-serif'],
                alfaslabone: ['Alfa Slab One', 'serif'],
            },
            backgroundImage: {
                'auth-pattern': "url('./assets/img/authbg.svg')",
            },
        },
    },
    plugins: [],
};
