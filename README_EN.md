# without-cdn

The use of CDN resources in Web projects can accelerate the access of the project, but sometimes the project is deployed in the internal network or the CDN we choose is unstable, which will lead to the awkward situation that the project cannot run normally after deployment.

Put all the CDN resource in the local, project will be a little more additional directories and files (these files don't need to be modified in ten thousand, carelessly point may also be formatted editor), but also need to submit into the code base, when need to reference the CDN resources to upgrade or change the version, need to be repeated again to download the corresponding resources committed to the project, also need to remove the previous version file.

If you also encounter some embarrassments in the process of development, I suggest you try without- CDN, which may bring you a little surprise.

### Installation without-cdn

> Global installation is recommended and can be used directly from the command line

```
$npm install -g without-cdn
```

### without-cdn Advantages & Working principles

Advantage:
​ CDN resources can be used in the development process. Instead of downloading CDN resources locally, the resource version can be changed by modifying the URL, and the CDN resources can be downloaded and replaced only when the project is deployed

Working principle:

1. Extract the script and link tags in the files to be processed, and analyze the URL beginning with HTTP
1. Download the extracted LIST of HTTP urls to the specified local directory
1. Change the HTTP URL in the file

### use in command line

```
$ withoutcdn --help

Options:
  -V, --version           output the version number
  -f --filepath <string>  the file path that to be processed
  -e --exclude <string>   exclude the CDN path, multiple paths use commas to separate
  -d --folder <string>    destination folder for the CDN file
  -lo --logsoff           logs off
  -h, --help              display help for command

// After building index.html，bootcdn jquery and alicdn font files are used
<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/><link rel="shortcut icon" href="/favicon.ico"/><title>XXXX有限公司</title><script src="https://cdn.bootcdn.net/ajax/libs/jquery/2.1.2/jquery.min.js"></script><script src="http://at.alicdn.com/t/font_2031940_kylw1ml1bn.js"></script>.....

// user withoutcdn
$ withoutcdn -f ./index.html -d static

withoutCDN start...

find CDN fileList:
https://cdn.bootcdn.net/ajax/libs/jquery/2.1.2/jquery.min.js
http://at.alicdn.com/t/font_2031940_kylw1ml1bn.js

download http://at.alicdn.com/t/font_2031940_kylw1ml1bn.js successfully.

download https://cdn.bootcdn.net/ajax/libs/jquery/2.1.2/jquery.min.js successfully.

// After processing the index.html， Also./static directory has added font_2031940_kylw1ml1bn.js jquery.min.js
<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/><link rel="shortcut icon" href="/favicon.ico"/><title>XXXX有限公司</title><script src="./static/jquery.min.js"></script><script src="./static/font_2031940_kylw1ml1bn.js"></script><style>...
```

### use in JS

````
​```
const withoutCDN = require("without-cdn");

// 参数说明
withoutCDN({
    log: boolean,               // Print logs
    filepath: string,           // Required parameters, file path to be processed, note whether the path is valid (using \\ or /), support full path, relative path
    exclude: string | string[], // Ignored path, support for using arrays to configure multiple paths
    folder: string              // The directory name of the CDN file downloaded, if it does not exist, will be created under the same path as the file being processed
});


withoutCDN({
    filepath: "build/index.html",
    folder: "static"
});

​```
````

### use in build react project

1: Globally install without- CDN and use post hooks in the scripts of packing.json, which is recommended

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

2： Install it in your project and call it in scripts/build.js

```
// scripts/build.js, checkBrowsers().then() call withoutCDN

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
