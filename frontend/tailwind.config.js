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
                'home-pattern': "url('./assets/img/homebg.svg')",
                musicbar:
                    'radial-gradient(50% 40% at center , #710083, transparent )',
            },
            transitionDuration: {
                400: '400ms',
            },
        },
    },
    plugins: [],
};
