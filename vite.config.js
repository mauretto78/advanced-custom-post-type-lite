import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { version, dependencies } from './package.json';

function renderChunks(deps) {
    let chunks = {};
    Object.keys(deps).forEach((key) => {
        if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
        chunks[key] = [key];
    });

    return chunks;
}

export default defineConfig({
    base: '/wp-content/plugins/advanced-custom-post-type/assets/build',
    define: {
        VERSION: JSON.stringify(version),
    },
    build: {
        outDir: './assets/build',
        manifest: true,
        minify: true,
        sourcemap: false,
        reportCompressedSize: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-router-dom', 'react-dom'],
                    ...renderChunks(dependencies),
                },
            },
            input: [
                "./assets/src/App/index.jsx",
                "./assets/src/Gutenberg/index.jsx",
            ]
        },
    },
    plugins: [
        react(),
    ],
})