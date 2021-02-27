const inquirer = require("inquirer");
const chalk = require("chalk");
const { createProject } = require("./main");
const commander = require("commander");
const { parseArgumentsIntoOptions } = require("./comandLineArg");
// const getUserGitCredentials = require("./git/getUserGitCredentials");

const executeGitCommand = require("./git/index");
const { createRemoteRepository } = require("./git/createRemoteRepo");

const packageJson = require("../package.json");

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .on("--help", () => {
    console.log();
    console.log(
      `      - specify a template eg =>  create-project <${chalk.cyan(
        "template name"
      )}> : eg <${chalk.cyan("react or typescript")}>`
    );
    console.log(
      `      - specify a installation flag eg =>  create-project <${chalk.cyan(
        "template name"
      )}> <${chalk.cyan("--install")}>`
    );
    console.log(`      - a specific npm tag: ${chalk.green("@next")}`);
    console.log();
  })
  .option(
    "-i, --install",
    "to install all dependencies for the current template"
  )
  .option("-y, --yes", "to skip from been prompted ")
  .option(
    "-g, --git",
    "to intialize a git repository or push the current repository to Github"
  )
  .allowUnknownOption()

  .parse(process.argv);

if (program.info) {
  envinfo
    .run(
      {
        System: ["OS", "CPU"],
        Binaries: ["Node", "npm", "Yarn"]
      },
      {
        duplicates: true,
        showNotFound: true
      }
    )
    .then(console.log);
}

async function promptFormMissingOptions(options) {
  const defaultTemplete = "JavaScript";

  if (options.skipPrompts) {
    return {
      ...options,
      templete: options.templete || defaultTemplete
    };
  }

  const questions = [];

  if (!options.templete) {
    questions.push({
      type: "list",
      name: "templete",
      message: chalk.white("Please choice which project templete to use"),
      choices: ["JavaScript", "TypeScript", "React", "React TypeSctip"],
      default: defaultTemplete
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: chalk.white("Initialize a git repository?"),
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    templete: options.templete || answers.templete,
    git: options.git || answers.git
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  //if it's create-project --git then else do nothing
  if (options.git) {
    executeGitCommand();
  }

  options = await promptFormMissingOptions(options);
  await createProject(options);
}
