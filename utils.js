#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs");
const pify = require("pify");
const writeFile = pify(fs.writeFile);

module.exports = {
  /**
   * Show deploy success message
   */
  deploySuccessMsg: function(id) {
    console.log(
      chalk.green(
        "Deploy script has been created. Run the command below to deploy:"
      ),
      chalk.bold(
        `\n\n gcloud functions deploy ${id} \\
            --runtime nodejs6 \\
            --trigger-resource cloud-builds \\
            --trigger-event google.pubsub.topic.publish\n\n`
      )
    );
  },

  /**
   * Render deploy script to a file.
   *
   * @param {string} renderedString The deploy script to render.
   * @param {string} filename The filename of the rendered file.
   */
  renderFile: function(renderedString, filename, id) {
    writeFile(filename, renderedString);
    module.exports.deploySuccessMsg(id);
    return renderedString;
  },

  /**
   * Control execution verbosity.
   *
   * @param {string} renderedString The deploy script to render.
   * @param {bool} verbosity If true, then renderedString is printed to console.
   */
  printVerbose: function(renderedString, verbosity) {
    if (verbosity) {
      console.log(renderedString);
    }
  }
};
