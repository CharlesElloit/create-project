const CLI = require("clui");
const Configstore = require("configstore");
const Octokit = require("@octokit/rest");
const Spinner = CLI.Spinner;
const { createBasicAuth } = require("@octokit/auth-basic");

const inquirer = require("./inquirer");
const packageJson = require("../../package.json");

const config = new Configstore(packageJson.name);

let octokit;

module.exports = {
  getOctokitInstance: function() {
    return octokit;
  },

  getGithubAuth: function(token) {
    const octokit = new Octokit({
      auth: token
    });
    return octokit;
  },

  getGithubStoredToken: function() {
    return config.get("github.token");
  },

  getPersonalAccessToken: async function() {
    const credentials = await inquirer.getUserGitCredentials();
    const status = new Spinner(
      "Authenticating your credentails, please wait..."
    );
    status.start();

    const auth = createBasicAuth({
      username: credentials.username,
      password: credentials.password,
      async on2Fa() {
        status.stop();
        // prompt user for the one-time password retrieved via SMS or authenticator app
        const response = await inquirer.getTwoFactorAuthenticationCode();
        status.start();
        return response.twoFactorAuthenticationCode;
      },
      token: {
        scopes: ["user", "public_repo", "repo", "repo:status"],
        note:
          "Automated git cli, the command-line tool for initalizing Git repos"
      }
    });

    try {
      const response = await auth();
      if (response.token) {
        config.set("github.token", response.token);
        return response.token;
      } else {
        throw new Error("Github token is not found");
      }
    } finally {
      status.stop();
    }
  }

  // getGithubAuth: function(token) {
  //   octokit = new Octokit({
  //     auth: token
  //   });
  // }
};
