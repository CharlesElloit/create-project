const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const ncp = require("ncp");
const { promisify } = require("util");
const execa = require("execa");
const Listr = require("listr");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const inquire = require("inquirer");
const { projectInstall } = require("pkg-install");

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTempleteFiles(options) {
  return copy(options.templeteDirectory, options.targetDirectory, {
    clobber: false
  });
}

async function initGit(options) {
  const result = execa("git", [
    "init",
    {
      cwd: path.basename(options.targetDirectory)
    }
  ]);

  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git repository"));
  }
  return result;
}

async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  };

  const currentFileUrl = import.meta.url;
  const templeteDir = path.resolve(
    new URL(currentFileUrl).pathname,
    "../../templetes",
    options.templete.toLowerCase()
  );
  options.templeteDirectory = templeteDir;

  try {
    await access(templeteDir, fs.constants.R_OK);
  } catch (error) {
    console.error("%s Invalid templete name", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  console.log("Coping project files");
  await copyTempleteFiles(options);

  const tasks = new Listr([
    {
      title: "Coping project files and folders",
      task: () => copyTempleteFiles(options)
    },
    {
      title: "Initializing Git Repository",
      task: () => initGit(options),
      enabled: () => options.git
    },

    {
      title:
        "Install dependencies this might take a couple of minutes please wait for the installation to finish.....",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory
        }),
      skip: () =>
        !options.runInstall
          ? "Pass --install or -i to automatically install dependencies"
          : undefined
    }
  ]);

  await tasks.run();

  console.log(
    `
   ${chalk.green(chalk.bold("Project Created successfully!"))} ${chalk.magenta(
      chalk.bold("Project ready! Happy hacking :)")
    )}

    ${chalk.white(
      "If you'r using vs code just type Code . to run your project in visual studio code"
    )}
    `
  );

  return true;
}

module.exports = { createProject };
