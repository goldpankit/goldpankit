import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import prismjs from 'vite-plugin-prismjs'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const apiPrefix = loadEnv(mode, process.cwd()).VITE_API_PREFIX
  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      prismjs({
        languages: 'all',
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        [apiPrefix]: {
          target: 'http://localhost/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${apiPrefix}`), "")
        },
        '/remote-api': {
          target: 'http://localhost:10088',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('/remote-api'), "")
        },
      }
    }
  })
}
