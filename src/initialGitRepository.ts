const inquirer = require("inquirer");
const chalk = require("chalk");

function getUserGitCredentials() {
  const questions: any = [
    {
      name: "username",
      type: "input",
      message: chalk.blue("Enter your GitHub username or email"),

      validateUserCredentials: function(username: string) {
        if (username.length) return true;
        return chalk.green("Please enter your username or email address.");
      } //End of validateUserCredentials
    }, //End to username or email value

    {
      name: "password",
      type: "password",
      message: chalk.green("Enter your password"),
      validateUserPassword: function(password: string) {
        if (password.length) return true;
        return chalk.green("Please octokitprovide your password.");
      } //End of validateUserPassword
    } //End of validateUserPassword
  ];

  return inquirer.prompt(questions);
}

module.exports = { getUserGitCredentials };
