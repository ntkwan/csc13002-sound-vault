import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': '/src/components',
            '@assets': '/src/assets',
            '@pages': '/src/pages',
            '@layouts': '/src/layouts',
            '@routes': '/src/routes',
            '@features': '/src/features',
        },
    },
});
