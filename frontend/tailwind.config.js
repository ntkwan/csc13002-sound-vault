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
            keyframes: {
                flyInOut: {
                    '0%': { transform: '', opacity: '0' },
                    '15%, 85%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: '', opacity: '0' },
                },
                'fade-in': {
                    '0%': {
                        opacity: '0',
                    },
                    '100%': {
                        opacity: '1',
                    },
                },
                'fade-out': {
                    '0%': {
                        opacity: '1',
                    },
                    '100%': {
                        opacity: '0',
                    },
                },
            },
            animation: {
                flyInOut: 'flyInOut 4s',
                'fade-in': 'fade-in 1s ease-in-out',
                'fade-out': 'fade-out 1s ease-in-out',
            },
        },
    },
    plugins: [],
};
