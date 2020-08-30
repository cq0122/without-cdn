const fs = require("fs-extra");
const cheerio = require("cheerio");
const wget = require("node-wget");
const replace = require("replace");

const consoleStyle = {
  bright: "\x1B[1m", // 亮色
  grey: "\x1B[2m", // 灰色
  italic: "\x1B[3m", // 斜体
  underline: "\x1B[4m", // 下划线
  reverse: "\x1B[7m", // 反向
  hidden: "\x1B[8m", // 隐藏
  black: "\x1B[30m", // 黑色
  red: "\x1B[31m", // 红色
  green: "\x1B[32m", // 绿色
  yellow: "\x1B[33m", // 黄色
  blue: "\x1B[34m", // 蓝色
  magenta: "\x1B[35m", // 品红
  cyan: "\x1B[36m", // 青色
  white: "\x1B[37m", // 白色
  blackBG: "\x1B[40m", // 背景色为黑色
  redBG: "\x1B[41m", // 背景色为红色
  greenBG: "\x1B[42m", // 背景色为绿色
  yellowBG: "\x1B[43m", // 背景色为黄色
  blueBG: "\x1B[44m", // 背景色为蓝色
  magentaBG: "\x1B[45m", // 背景色为品红
  cyanBG: "\x1B[46m", // 背景色为青色
  whiteBG: "\x1B[47m" // 背景色为白色
};

const some = (arr, fn) => {
  let result = false;
  for (const value of arr) {
    result = result || fn(value);
    if (result) {
      return true;
    }
  }
  return result;
};

const curry = (fn) => {
  if (typeof fn !== "function") {
    throw Error("No function provided");
  }
  return function curriedFn(...args) {
    if (args.length < fn.length) {
      return function () {
        return curriedFn.apply(null, [...args, ...Array.from(arguments)]);
      };
    }
    return fn.apply(null, args);
  };
};

const consoleLog = function (logOn, text, style = undefined) {
  if (logOn) {
    if (style && consoleStyle[style]) {
      console.log(`${consoleStyle[style]}${text}\x1B[0m`);
    } else {
      console.log(text);
    }
  }
};

export const withoutCDN = function (config) {
  const { log = true, filepath, exclude, folder } = config;
  const logger = curry(consoleLog)(log); //curry
  // const logger = (text, style) => consoleLog(log, text, style);
  logger("\nwithoutCDN start...\n");
  let file;
  try {
    file = fs.readFileSync(filepath);
  } catch (err) {
    logger(err, "red");
    return;
  }

  const html = cheerio.load(file)("html");
  const scriptArr = Array.from(html.find("script"))
    .filter((item) => {
      if (
        item.attribs &&
        item.attribs.src &&
        item.attribs.src.startsWith("http")
      ) {
        return item.attribs.src;
      }
    })
    .map((item) => item.attribs.src);
  const linkArr = Array.from(html.find("link"))
    .filter((item) => {
      if (
        item.attribs &&
        item.attribs.href &&
        item.attribs.href.startsWith("http")
      ) {
        return item.attribs.href;
      }
    })
    .map((item) => item.attribs.href);

  const httpUrlArr = [...scriptArr, ...linkArr];

  if (httpUrlArr.length === 0) {
    logger("No CDN reference found.\n");
    return;
  }
  logger("find CDN fileList:", "green");
  httpUrlArr.forEach((item) => {
    logger(item, "underline");
  });
  logger("");

  let excludeHttpUrlArr = [];
  if (exclude) {
    let excludeArr;
    if (Array.isArray(exclude)) {
      excludeArr = exclude;
    } else {
      excludeArr = [String(exclude)];
    }

    excludeHttpUrlArr = httpUrlArr.filter((item) => {
      if (some(excludeArr, (v) => item.includes(v))) {
        return item;
      }
    });
    logger("exclude CDN fileList:", "red");
    excludeHttpUrlArr.forEach((item) => {
      logger(item, "underline");
    });
    logger("");
  }

  let dest = filepath
    .replace(/\\/g, "/")
    .substring(0, filepath.replace(/\\/g, "/").lastIndexOf("/") + 1);
  let localDest = "./";
  if (folder && String(folder)) {
    let folderStr = String(folder).replace(/\\/g, "/");
    if (folderStr.startsWith("/")) {
      folderStr = folderStr.substring(1);
    }
    if (folderStr.endsWith("/")) {
      folderStr = folderStr.substring(0, folderStr.length - 1);
    }
    dest = dest + folderStr + "/";
    localDest = localDest + folderStr + "/";
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  httpUrlArr.forEach((url) => {
    if (!excludeHttpUrlArr.includes(url)) {
      wget({ url, dest }, function (err, data) {
        if (err) {
          logger(`download ${url} ${err}`, "red");
        } else {
          logger(`download ${url} successfully. \n`, "green");
          replace({
            regex: url,
            replacement: localDest + url.substring(url.lastIndexOf("/") + 1),
            paths: [filepath],
            recursive: true,
            silent: true
          });
        }
      });
    }
  });
};

module.exports = withoutCDN;
export default withoutCDN;
