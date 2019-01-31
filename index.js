#!/usr/bin/env node

const chalk = require("chalk");
const path = require("path");
const { renderString, renderTemplateFile } = require("template-file");

var utils = require("./utils");

/**
 * Build command-line arguments
 */
const argv = require("yargs")
  .options("id", {
    alias: "i",
    describe: "deploy function unique ID",
    demand: "function ID must be specified",
    type: "string"
  })
  .options("repository", {
    alias: "r",
    describe: "target repository",
    demand: "target repository must be specified",
    type: "string"
  })
  .options("branches", {
    alias: "b",
    describe: "target branches",
    demand: "a branch or list of branches must be specified",
    type: "array"
  })
  .options("bucket", {
    alias: "k",
    describe: "bucket to source and store badges",
    demand: "bucket must be specified",
    type: "string"
  })
  .options("verbose", {
    alias: "v",
    default: false
  })
  .help().argv;

/**
 * Setup data for template
 */
const data = {
  id: argv.id,
  repository: argv.repository,
  branch: "'" + argv.branches.join("','") + "'",
  bucket: argv.bucket
};

/**
 * Render template and save to file
 */
console.log(chalk.yellow("Creating a deploy function from template"));
renderTemplateFile(path.resolve(__dirname, "./templates/template-github"), data)
  .then(renderedString => utils.renderFile(renderedString, "function.js", argv.id))
  .then(renderedString => utils.printVerbose(renderedString, argv.verbose));
