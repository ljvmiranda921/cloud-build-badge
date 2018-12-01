#!/usr/bin/env node
const fs = require("fs");
const pify = require("pify");
const writeFile = pify(fs.writeFile);
const chalk = require("chalk");
const { renderString, renderTemplateFile } = require("template-file");

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

function renderFile(renderedString, filename) {
  writeFile(filename, renderedString);
  return renderedString;
}

function printVerbose(renderedString, verbosity) {
  if (verbosity) {
    console.log(renderedString);
  }
}

console.log(chalk.yellow("Creating a deploy function from template"));
renderTemplateFile(
  "./node_modules/cloud-build-badge/templates/template-github",
  data
)
  .then(renderedString => renderFile(renderedString, "cloud_build_deploy.js"))
  .then(renderedString => printVerbose(renderedString, argv.verbose));

var deployFcn = "deployBadge_" + argv.id;

console.log(
  chalk.green(
    "Deploy script has been created. Run the command below to deploy:"
  ),
  chalk.bold(
    `\n\n gcloud functions deploy ${deployFcn} --runtime nodejs6 --trigger-resource cloud-builds --trigger-event google.pubsub.topic.publish\n\n`
  )
);
