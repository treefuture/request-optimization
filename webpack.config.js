const path = require("path")
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin');

const {
  getFilesAndFoldersInDir
} = require("./utils/readFile")

// 添加js文件过滤
const entryList = getFilesAndFoldersInDir(path.resolve(__dirname, "src"), false)
  .filter(item => path.basename(item.name, '.js') !== 'constantPool')
  .reduce((entries, item) => {
    const name = path.basename(item.name, '.js');
    entries[name] = path.resolve(__dirname, `src/${item.name}`);
    return entries;
  }, {});

module.exports = [{
  name: "run",
  entry: entryList,
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
  entry: path.resolve(__dirname, "public"),
  output: {
    filename: "[name].[contenthash:5].js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
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
    }),
  ],
}]