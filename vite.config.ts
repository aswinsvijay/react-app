import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), viteSingleFile()],
});
