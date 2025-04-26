const path = require("path")
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const {
  getFilesAndFoldersInDir
} = require("./utils/readFile")

// 添加JSON文件过滤
const entryList = getFilesAndFoldersInDir(path.resolve(__dirname, "src"))
  .filter(item => path.extname(item.name) === '.json')
  .reduce((entries, item) => {
    const name = path.basename(item.name, '.json');
    entries[name] = path.resolve(__dirname, `src/${item.name}`);
    return entries;
  }, {});

module.exports = {
  entry: entryList,
  output: {
    filename: '[name].[contenthash:5].js',
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [{
      test: /\.json$/,
      type: 'asset/resource', // 作为静态资源处理
      generator: {
        filename: '[name].[contenthash:5][ext]' // 保持原始JSON文件名
      }
    }]
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
    })
  ]
}