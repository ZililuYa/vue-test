const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}
// CDN预加载使用
const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios',
  'iview': 'iview',
  'js-cookie': 'Cookies',
  'echarts': 'echarts',
  'vue-i18n': 'VueI18n'
}

const cdn = {
  // 开发环境
  dev: {
    css: [
      'https://cdn.bootcss.com/iview/3.4.1/styles/iview.css'
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      'https://cdn.bootcss.com/iview/3.4.1/styles/iview.css'
    ],
    js: [
      'https://cdn.bootcss.com/vue/2.5.21/vue.min.js',
      'https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js',
      'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
      'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
      'https://cdn.bootcss.com/iview/3.4.1/iview.min.js',
      'https://cdn.bootcss.com/vue-i18n/8.11.2/vue-i18n.min.js',
      'https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js',
      'https://cdn.bootcss.com/echarts/4.2.1-rc1/echarts.min.js'
    ]
  }
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  baseUrl: BASE_URL,
  // 输出文件目录
  outputDir: './static',
  // 静态资源目录(相对于outputDir)
  // assetsDir: 'public',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // host: '10.10.11.28',
    // port: 8888,
    // open: true,
    // 代理
    proxy: {
      '/api': {
        target: 'http://10.10.46.44:10012',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    // 浏览器同步显示警告和错误
    overlay: {
      warnings: true,
      errors: true
    }
  },
  // webpack配置
  chainWebpack: config => {
    // config.plugins.delete('preload')
    // config.plugins.delete('prefetch')
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    // 添加CDN参数到htmlWebpackPlugin配置中
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })
  },
  // 修改webpack config, 使其不打包externals下的资源
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境npm包转CDN
      config.externals = externals
    }
  }
}
