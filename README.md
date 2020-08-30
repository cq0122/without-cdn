# without-cdn

> Web projects are deployed to a server, sometimes running on a LAN, and the CDN reference needs to be removed during deployment.

### Installation without-cdn.

```
$npm install -g without-cdn
```

### Use without-cdn.

```
$ withoutcdn --help

Options:
  -V, --version           output the version number
  -f --filepath <string>  the file path that to be processed
  -e --exclude <string>   exclude the CDN path, multiple paths use commas to separate
  -d --folder <string>    destination folder for the CDN file
  -lo --logsoff           logs off
  -h, --help              display help for command

$ withoutcdn -f D:\\Github\\theme\\build\\index.html -d static/js/

// index.html -> <!doctype html><html lang="en">...<script src=""http://at.alicdn.com/t/font_2031940_kylw1ml1bn.js"></script>...
// index.html -> <!doctype html><html lang="en">...<script src="./static/js/font_2031940_kylw1ml1bn.js"></script>...
```

```
const withoutCDN = require("without-cdn");

withoutCDN({
    filepath: "build/index.html"
});

// config
withoutCDN({
    log: true|false, //logs on | off
    filepath: string, //the file path that to be processed
    exclude: string | string[], //exclude the CDN paths
    folder: string //destination folder for the CDN file
});
```

```
import withoutCDN from "without-cdn";

withoutCDN({
    filepath: "build/index.html"
});
```

### Use in Project build.

##### 💙 Add withoutCDN function in build.js

```
// scripts/build.js, search 'Compiled successfully', add call withoutCDN

...
const FileSizeReporter = require("react-dev-utils/FileSizeReporter");
const printBuildError = require("react-dev-utils/printBuildError");
const withoutCDN = require("without-cdn");
...
...
} else {
    console.log(chalk.green("Compiled successfully.\n"));
}

withoutCDN({
    filepath: "build/index.html"
});

console.log("File sizes after gzip:\n");
...
...
```

##### 💙 Global install，use postbuild scripts

```
// pacage.json, add postbuild script

...
"scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "postbuild": "withoutcdn -f build/index.html",
    "test": "node scripts/test.js"
},
...
```

> Hope you will like !
