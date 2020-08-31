# without-cdn

Web 项目使用 CDN 资源能加速项目的访问，但是有时候项目部署在内网或者我们选用的 CDN 不稳定，就会出现项目部署后无法正常运行的尴尬情况。

把 CDN 资源全部放在本地，项目中就会多出一些额外的目录和文件（这些文件万年不需要修改，一不小心点开还可能被编辑器格式化了），而且还需要提交进代码库，当需要对引用 CDN 资源升级或者更换版本时，又需要重复去下载对应的资源提交到项目中，还需要移除之前的版本文件。

如果你开发的过程中也碰到过上面的小尴尬，建议你试试 without-cdn，说不定能带给你一点小惊喜。

### 安装 without-cdn

> 建议全局安装，可以直接在命令行中使用

```
$npm install -g without-cdn
```

### 优势&工作原理

优势：

​ ​ ​ 开发过程中可以使用 CDN 资源，CDN 资源不用下载到本地，修改 url 即可更换资源版本，且仅在项目部署时下载和替换 CDN 资源

工作原理：

1. 对需要处理的文件中 script 和 link 标签进行提取，分析出以 http 开头的 url
1. 将提取的 http url 列表下载到指定的本地目录
1. 更换文件中的 http url

### 命令行使用

```
$ withoutcdn --help

Options:
  -V, --version           output the version number
  -f --filepath <string>  the file path that to be processed
  -e --exclude <string>   exclude the CDN path, multiple paths use commas to separate
  -d --folder <string>    destination folder for the CDN file
  -lo --logsoff           logs off
  -h, --help              display help for command

Options:
  -V, --version           显示版本
  -f --filepath <string>  必填参数，需要处理的文件路径，注意路径是否有效（使用\\或/），支持全路径、相对路径
  -e --exclude <string>   忽略的路径，支持配置多个路径，用半角逗号分割。例如项目中使用了多个CDN，自建的CDN路径不需要下载替换，可以配置exclude。
  -d --folder <string>    CDN文件下载的目录名称，如不存在会在处理文件的同一路径下创建
  -lo --logsoff           是否打印日志，加上-lo或--logsoff关闭日志输出
  -h, --help              显示帮助


// build后的index.html，使用了bootcdn的jquery和alicdn的font文件
<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/><link rel="shortcut icon" href="/favicon.ico"/><title>XXXX有限公司</title><script src="https://cdn.bootcdn.net/ajax/libs/jquery/2.1.2/jquery.min.js"></script><script src="http://at.alicdn.com/t/font_2031940_kylw1ml1bn.js"></script>.....

// 使用withoutcdn处理index.html
$ withoutcdn -f ./index.html -d static

withoutCDN start...

find CDN fileList:
https://cdn.bootcdn.net/ajax/libs/jquery/2.1.2/jquery.min.js
http://at.alicdn.com/t/font_2031940_kylw1ml1bn.js

download http://at.alicdn.com/t/font_2031940_kylw1ml1bn.js successfully.

download https://cdn.bootcdn.net/ajax/libs/jquery/2.1.2/jquery.min.js successfully.

// 处理后的index.html，同时./static目录下多出了font_2031940_kylw1ml1bn.js jquery.min.js
<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/><link rel="shortcut icon" href="/favicon.ico"/><title>XXXX有限公司</title><script src="./static/jquery.min.js"></script><script src="./static/font_2031940_kylw1ml1bn.js"></script><style>...
```

### JS 中使用

````
​```
const withoutCDN = require("without-cdn");

// 参数说明
withoutCDN({
    log: boolean,               // 是否打印日志
    filepath: string,           // 必填参数，需要处理的文件路径，注意路径是否有效（使用\\或/），支持全路径、相对路径
    exclude: string | string[], // 忽略的路径,支持使用数组配置多个路径
    folder: string              // CDN文件下载的目录名称，如不存在会在处理的文件同一路径下创建
});


withoutCDN({
    filepath: "build/index.html",
    folder: "static"
});

​```
````

### React 项目打包时使用 without-cdn

方法一：全局安装 without-cdn，在 package.json 的 scripts 中使用 post 钩子，推荐使用该方法

```
// "postbuild": "withoutcdn -f build/index.html -d static",

"scripts": {
    "build-css": "node-less-chokidar src/ -o src/",
    "watch-css": "npm run build-css && node-less-chokidar src/ -o src/ --watch --recursive",
    "start-js": "react-app-rewired start",
    "start": " npm-run-all -p start-js",
    "build-js": "react-app-rewired build",
    "build": "npm-run-all build-js",
    "postbuild": "withoutcdn -f build/index.html -d static",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
},
```

方法二： 在项目中安装，在 scripts/build.js 中调用

```
// scripts/build.js, 在checkBrowsers()的最后一个then()中调用withoutCDN

...
...
const FileSizeReporter = require("react-dev-utils/FileSizeReporter");
const printBuildError = require("react-dev-utils/printBuildError");
const withoutCDN = require("without-cdn");
...
...
const { checkBrowsers } = require("react-dev-utils/browsersHelper");
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
  })
  .then((previousFileSizes) => {
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      ...
      ...
      ...
      withoutCDN({
        filepath: "build/index.html",
        folder: "static"
      });
    },
    (err) => {
    }
  )
  .catch((err) => {
  });
...
...
```

> Hope you will like !
