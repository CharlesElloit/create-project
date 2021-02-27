const inquirer = require("inquirer");
const packageJson = require("../../package.json");

function getRepoDetails() {
  const argv = require("minimist")(process.argv.slice(2));

  const questions = [
    {
      name: "Repository Name",
      type: "input",
      message: "Enter a name for the repository~#",
      default: argv._[0] || files.getCurrentRootDirectory(),

      validateRepoName: function(name) {
        if (name.length) return true;
        return "Please provide a name to the repository.";
      }
    }, //End of Repository Name

    {
      name: "Description",
      type: "input",
      message: "Optionally enter a description.",
      default: argv._[1] || packageJson.description
    }, //End of Description,

    {
      name: "visibility",
      type: "list",
      message: "Public or Private",
      choices: ["public", "private"],
      default: "public"
    }
  ]; //End of question.

  return inquirer.prompt(questions);
}

module.exports = getRepoDetails;
