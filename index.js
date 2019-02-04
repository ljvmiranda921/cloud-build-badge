#!/usr/bin/env node

const chalk = require("chalk");
const path = require("path");
const { renderString, renderTemplateFile } = require("template-file");

var utils = require("./utils");

// Build command-line arguments
const argv = require("yargs")
  .usage(
    "Create a deployable Cloud Function by providing arguments to the parameters below"
  )
  .options("id", {
    alias: "i",
    describe: "Deploy function unique ID",
    demand: "Function ID must be specified",
    type: "string"
  })
  .options("repository", {
    alias: "r",
    describe: "Target repository",
    demand: "Target repository must be specified",
    type: "string"
  })
  .options("branches", {
    alias: "b",
    describe: "Target branches",
    demand: "A branch or list of branches must be specified",
    type: "array"
  })
  .options("bucket", {
    alias: "k",
    describe: "Bucket to source and store badges",
    demand: "Bucket must be specified",
    type: "string"
  })
  .options("verbose", {
    alias: "v",
    default: false
  })
  .epilogue(
    "For more information, please visit: https://github.com/ljvmiranda921/cloud-build-badge"
  )
  .help().argv;

// Setup data for template
const data = {
  id: argv.id,
  repository: argv.repository,
  branch: "'" + argv.branches.join("','") + "'",
  bucket: argv.bucket
};

// Render template and save to file
console.log(chalk.yellow("Creating a deploy function from template"));
renderTemplateFile(path.resolve(__dirname, "./templates/template-github"), data)
  .then(renderedString =>
    utils.renderFile(renderedString, "function.js", argv.id)
  )
  .then(renderedString => utils.printVerbose(renderedString, argv.verbose));
