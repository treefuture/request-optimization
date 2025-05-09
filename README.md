# 依赖下载

#### 纯前端项目介绍(不重要)

纯前端项目如果没有 `noode` 做中间层，是做不了按需请求的。这里说的按需请求不是做不了 `Ajax` 按需加载数据，比如进入 `xxx` 页面再去请求 `xxx` 数据还是能做到的。但是，如果你要访问一个文件的某一处数据的时候是做不了按需请求的，比如现在有 100 篇博客文章，而用户想看其中具体某一篇的时候，纯前端 ( 无 `node` 中间层支持 ) 是做不了按需请求文章的，只能够将所有文章数据全部请求，然后再根据用户需求进行筛选。但是如果等用户想看的时候才进行数据加载就已经晚了，因为数据量的原因，加载的时间可能会超出用户预期，这种情况下就只有先对数据进行全量请求，然后进行缓存，这样才能做到用户在访问的时候能够快速定位资源。

这种解决方案就是使用浏览器缓存，但这种情况也存在一个弊端，即如何保证数据是最新的，当前我个人的解决方案是用户每次进入网站或每次刷新的时候都对数据进行请求，然后优先使用本地缓存，等数据请求完成后再进行替换。这种方案其实有很大的漏洞：

1、`SPA` ( 单页面应用网站 ) 在第一次加载的时候速度会很慢；

2、用户每次刷新都对数据进行全量请求，流量消耗是比较大的；

3、会造成网站数据的不稳定，比如用户在进行某些数据操作的时候，数据更新初始化可能会导致用户操作被重置导致用户体验差。

以上介绍皆为个人项目感受，以下是个人想到的解决方案：( 第一个问题并未解决 )

#### 前言

这是一个纯前端优化请求的想法，当然这不是最好的，最好的办法应该是用 `node` 搭个服务器，但对我而言时间成本有点高，所以想了这么一个实现方案。该方案最核心的点就是通过 `webpack` 打包生成的 `hash` 值来判断数据是否有更新，只请求更新过的数据，没有更新的数据就使用本地缓存。

#### 依赖

需要使用 `node` 和 `webpack` 的依赖,直接复制粘贴就好了

```
yarn: 
yarn add -D webpack webpack-cli clean-webpack-plugin html-webpack-plugin json-minimizer-webpack-plugin compression-webpack-plugin
yarn add pako
或者
npm: 
npm i -D webpack webpack-cli clean-webpack-plugin html-webpack-plugin json-minimizer-webpack-plugin compression-webpack-plugin
npm i pako
```

#### 运行文件

我用的 `yarn`，你可以根据自己的习惯执行命令

```
运行使用：yarn dev
打包使用：yarn build
生成数据中间层：yarn fileWrite

已添加IndexDB的服务支持：

运行的时候执行 dist 目录下的 index.html 使用的是 localStorage 本地储存
运行的时候执行 indexDB 目录下的 index.html 使用的是 indexDB 数据库储存

目前dist目录下的文件需要上传到服务器运行，本地运行请使用indexDB文件夹下的index.html
如果一定要在本地运行dist目录下的文件请在src目录下idnex.js中的请求前加上相应的根目录 `fetch("/xxx/xxx.json")` `dataRequest(`/xxx/${xxx}`, xxx)` 然后重新打包

后面我默认使用 yarn 执行命令，如果是使用 npm 包就将 'yarn xxx' 换成 'npm run xxx' 就行了
```

`dev` 是开发环境，会监听文件的变化。

`build` 是生产环境，默认会压缩文件，但这是 `json` 文件，不会压缩，一般就用开发环境就好了，文件更改后会自动监听，`build` 是为了以后可能有其他配置。

文件改动之后需要使用 `yarn fileWrite` 重新生成一下 `data.json` 文件。`data.json` 文件会读取打包出来的 `json` 文件信息==>我们重新给 `webpack` 添加了一个插件，现在每次重新构建都会自动执行 `yarn fileWrite` 所以无论是使用 `yarn dev` 还是使用 `yarn build` 都会自动生成 `data.json` 文件信息了。

进入页面的时候会自动调用初始化函数进行数据请求，请求优化就是通过对比 `data.json` 和本地缓存中的 `hash` 值来判断数据是否更新，如果不请求优化就是每次刷新页面的时候进行数据的全量加载。

`dist` 目录下使用的是 `localStorage` 进行数据存储，存储最大值为 `5MB`，但当前使用的数据中有一个已经超出最大范围了，所以是存储不了的，也正好作为请求优化中无法被缓存的数据重复请求的示例，如果想要使用更大的本地缓存空间可以使用 `indexDB` 目录下的 `index.html` 使用的是 `indexDB` 进行数据存储。需要注意的是 `indexDB` 的数据是异步获取的，使用 `Promise` ，而 `localStorage` 是同步获取数据。**`dist` 目录下的文件已经不再支持本地运行**

目前是针对： [世界 online 属性计算 Utils](http://www.worldonlinetools.top/#/windows-home) 纯前端项目的数据请求方案，这个项目目前并不是开源的，因为技术太差，所以目前并无开源打算；项目中的数据就是纯前端所使用的数据 ( 不过有些已经废弃，但只是作为示例的话我觉得问题不大 ) 数据文件地址：<https://github.com/treefuture/World-Online.git>
