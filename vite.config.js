import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {version} from './package.json';

// `pnpm build` (mode "production") is minified for releases; any other mode
// (`pnpm build:staging`, `pnpm watch`) keeps the code readable and
// adds source maps for debugging. React stays on its production build either way.
export default defineConfig(({mode}) => {
    const isProd = mode === 'production';

    return {
        base: '/wp-content/plugins/acpt-lite/assets/build',
        define: {
            VERSION: JSON.stringify(version),
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // Silences the legacy-js-api deprecation warning; 'modern' works
                    // with the plain `sass` package already installed (no need for
                    // the separate `sass-embedded` package that 'modern-compiler' requires).
                    api: 'modern',
                },
            },
        },
        build: {
            outDir: './assets/build',
            manifest: true,
            minify: isProd,
            sourcemap: !isProd,
            reportCompressedSize: isProd,
            // The API page (lazy-loaded) bundles Swagger UI and its dependencies,
            // ~1.2 MB on their own; every other chunk is well under 500 kB.
            // Unminified sizes say nothing about production, so no limit there.
            chunkSizeWarningLimit: isProd ? 1300 : Infinity,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-router-dom', 'react-dom'],
                    },
                },
                input: [
                    "./assets/src/App/index.jsx",
                    "./assets/src/Gutenberg/index.jsx",
                ]
            },
        },
        plugins: [
            react({
                babel: {
                    plugins: ['@babel/plugin-proposal-optional-chaining'],
                },
            }),
        ],
    };
});
