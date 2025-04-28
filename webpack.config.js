const path = require("path")
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin');

const {
  getFilesAndFoldersInDir
} = require("./utils/readFile")

// 自定义插件，在构建完成后执行脚本
const {
  exec
} = require('child_process');

class RunAfterBuildPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('RunAfterBuild', () => {
      exec('node utils/writeFile.js', (err, stdout, stderr) => {
        if (err) console.error(err);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
      });
    });
  }
}

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
    }),
    new RunAfterBuildPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new JsonMinimizerPlugin(),
    ],
  },
}