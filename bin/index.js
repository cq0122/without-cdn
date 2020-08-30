#!/usr/bin/env node

const { program } = require("commander");
program.version("1.0.0");

program
  .requiredOption(
    "-f --filepath <string>",
    "the file path that to be processed"
  )
  .option(
    "-e --exclude <string>",
    "exclude the CDN path, multiple paths use commas to separate"
  )
  .option("-d --folder <string>", "destination folder for the CDN file")
  .option("-lo --logsoff", "logs off")
  .parse(process.argv);

const { logsoff, filepath, exclude, folder } = program.opts();

var withoutCDN = require("../lib/index");

withoutCDN({
  log: !logsoff,
  filepath,
  exclude: exclude && exclude.includes(",") ? exclude.split(",") : exclude,
  folder
});
