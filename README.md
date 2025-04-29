# 依赖下载

#### 前言

由于使用框架进行构建和打包的时候 `webapck-cli` 会对原本的项目文件进行一次打包，我不想破坏原本框架设置的默认命令，所以选择在原本打包的基础上进行二次打包，打包指向的目录为 `dist` (`webpack` 打包默认出口)

#### 依赖

需要使用 `node` 和 `webpack` 的依赖,直接复制粘贴就好了

```
yarn: yarn add -D webpack webpack-cli clean-webpack-plugin html-webpack-plugin copy-webpack-plugin webpack-dev-server
或者
npm: npm i -D webpack webpack-cli clean-webpack-plugin html-webpack-plugin copy-webpack-plugin webpack-dev-server
```

#### 运行文件

我用的 `yarn`，你可以根据自己的习惯执行命令

```
目前不支持热更新，dev-server 文件引入路径有问题目前还没有研究明白...

目前dist目录下的文件需要上传到服务器运行，本地运行请使用indexDB文件夹下的index.html

运行使用：yarn dev
打包使用：yarn build ==> 打包的时候会自动进行二段构建，直接运行 release 中的 index.html 就好了(release 是二段打包的出口)
生成数据中间层：yarn fileWrite

已添加IndexDB的服务支持：

运行的时候执行 dist 目录下的 index.html 使用的是 localStorage 本地储存
运行的时候执行 indexDB 目录下的 index.html 使用的是 indexDB 数据库储存

后面我默认使用 yarn 执行命令，如果是使用 npm 包就将 'yarn xxx' 换成 'npm run xxx' 就行了
```
