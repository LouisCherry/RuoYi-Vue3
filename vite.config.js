import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import createVitePlugins from './vite/plugins';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV, VITE_PROD_API_TARGET } = env;

  // 代理配置：同时支持/dev-api和/prod-api
  const proxyConfig = {
    // 开发环境默认代理（/dev-api）
    '/dev-api': {
      target: 'http://localhost:8080', // 开发环境后端地址
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/dev-api/, '')
    },
    // 新增：生产环境风格代理（/prod-api）
    '/prod-api': {
      // 优先使用环境变量配置的生产目标地址，默认 fallback 到开发地址
      target: VITE_PROD_API_TARGET || 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/prod-api/, '')
    }
  };

  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    build: {
      cssCodeSplit: true, // 默认为 true，生产环境拆分 CSS
    },
    // vite 相关配置
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: proxyConfig, // 应用代理配置
      middlewareMode: false
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      // 强制开发环境生成独立 CSS 文件（非默认行为）
      devSourcemap: true, // 生成 sourcemap 便于定位
      extract: true, // 关键：提取 CSS 为独立文件（开发/生产均生效）
      preprocessorOptions: {
        scss: {
          // 确保 SCSS 解析正常
          importer: (url) => {
            if (url.startsWith('@/')) {
              return { file: path.resolve(__dirname, 'src', url.slice(2)) };
            }
            return null;
          }
        }
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  }
})

