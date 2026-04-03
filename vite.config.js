import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',
        port: 55176,
        strictPort: true,
        hmr: {
            host: 'localhost',
            port: 55176,
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
