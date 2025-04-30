const path = require("path")
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [{
  name: "run",
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: "[name].[contenthash:5].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack App",
      meta: {
        name: "这是一个请求示例"
      },
      scriptLoading: 'defer',
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'public/static'), // 源文件夹路径
        to: path.resolve(__dirname, 'dist/static'), // 输出文件夹路径（默认是 dist）
      }, {
        from: path.resolve(__dirname, 'src/data'), // 源文件夹路径
        to: path.resolve(__dirname, 'dist'), // 输出文件夹路径（默认是 dist）
      }, ],
    }),
  ],
}, {
  name: "server",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "[name].[contenthash:5].js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    static: [{
        directory: path.resolve(__dirname, 'dist'), // 默认输出目录
        publicPath: '/',
      },
      {
        directory: path.resolve(__dirname, 'release'), // 新增的静态目录
        publicPath: '/', // 浏览器访问路径前缀
      }
    ],
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack App",
      meta: {
        name: "这是一个请求示例"
      },
      scriptLoading: 'defer',
      template: path.resolve(__dirname, 'public/index.html')
    })
  ],
}]