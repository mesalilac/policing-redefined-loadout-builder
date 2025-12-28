import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [devtools(), solidPlugin()],
    base: '/policing-redefined-loadout-builder/',
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
    },
});
