var inquirer = require("inquirer");
var chalk = require("chalk");
function getUserGitCredentials() {
    var questions = [
        {
            name: "username",
            type: "input",
            message: chalk.blue("Enter your GitHub username or email"),
            validateUserCredentials: function (username) {
                if (username.length)
                    return true;
                return chalk.green("Please enter your username or email address.");
            } //End of validateUserCredentials
        },
        {
            name: "password",
            type: "password",
            message: chalk.green("Enter your password"),
            validateUserPassword: function (password) {
                if (password.length)
                    return true;
                return chalk.green("Please octokitprovide your password.");
            } //End of validateUserPassword
        } //End of validateUserPassword
    ];
    return inquirer.prompt(questions);
}
module.exports = { getUserGitCredentials: getUserGitCredentials };
