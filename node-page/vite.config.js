import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import prismjs from 'vite-plugin-prismjs'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const localApiPrefix = loadEnv(mode, process.cwd()).VITE_LOCAL_API_PREFIX
  const remoteApiPrefix = loadEnv(mode, process.cwd()).VITE_REMOTE_API_PREFIX
  return defineConfig({
    build: {
      outDir: '../node-service/public'
    },
    plugins: [
      vue(),
      vueJsx(),
      // 扩展markdown所有语言包
      prismjs({
        languages: 'all',
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.vue', '.js']
    },
    server: {
      host: '127.0.0.1',
      proxy: {
        [localApiPrefix]: {
          target: 'http://localhost:8130/local-api',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${localApiPrefix}`), "")
        },
        [remoteApiPrefix]: {
          target: 'http://localhost:10088',
          // target: 'http://client-api.goldpankit.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${remoteApiPrefix}`), "")
        },
        ['/resource']: {
          target: 'http://localhost:10088/resource',
          // target: 'http://client-api.goldpankit.com/resource',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^/resource`), "")
        }
      }
    }
  })
}
