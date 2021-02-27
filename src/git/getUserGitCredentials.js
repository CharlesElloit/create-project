const chalk = require("chalk");
const inquirer = require("inquirer");

async function getUserGitCredentials(options) {
  const questions = [];
  if (options.git) {
    questions.push(
      {
        name: "username",
        type: "input",
        message: chalk.white("Enter your GitHub username or email"),

        validateUserCredentials: function(username) {
          if (username.length) return true;
          return chalk.white("Please enter your username or email address.");
        } //End of validateUserCredentials
      }, //End to username or email value

      {
        name: "password",
        type: "password",
        message: chalk.white("Enter your password"),
        validateUserPassword: function(password) {
          if (password.length) return true;
          return chalk.green("Please provide your password.");
        } //End of validateUserPassword
      } //End of validateUserPassword)
    );
  }

  const answers = await inquirer.prompt(questions);
  console.log(answers);
  process.exit(1);
}

module.exports = getUserGitCredentials;
