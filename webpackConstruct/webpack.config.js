const path = require("path")
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin")
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const {
  getFilesAndFoldersInDir
} = require("../utils/readFile")

// 添加JSON文件过滤
const entryList = getFilesAndFoldersInDir(path.resolve(__dirname, "../dist"))
  .filter(item => path.extname(item.name) === '.json')
  .reduce((entries, item) => {
    const name = path.basename(item.name, '.json');
    entries[name] = path.resolve(__dirname, '..', `dist/${item.name}`);
    return entries;
  }, {});

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

module.exports = {
  entry: entryList,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "..", "release")
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
    new RunAfterBuildPlugin(),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../dist'), // 源文件夹路径
        to: path.resolve(__dirname, '../release'), // 输出文件夹路径（默认是 dist）
        globOptions: {
          ignore: ['**/*.json'], // 忽略所有 JSON 文件
        },
      }],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new JsonMinimizerPlugin(),
    ],
  }
}