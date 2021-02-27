const inquirer = require("./inquirer");
const githubfile = require("./github");

async function createRemoteRepository() {
  const github = githubfile.getOctokitInstance();
  const repoDetailsAnswers = inquirer.getRepoDetails();

  const packageJson = require("../../package.json");

  const repoData = {
    name: packageJson.name,
    description: packageJson.description,
    private: repoDetailsAnswers.visibility === "private"
  };

  const status = new Spinner("Creating remote repository... ");
  status.start();

  try {
    const response = await github.repos.createForAuthenticatedUser(repoData);
    return response.data.ssh_url;
  } finally {
    status.stop();
  }
}

async function createGitignoreFile() {
  const fileList = _lodash.without(fs.readdirSync(".", ".git", ".gitignore"));
  if (fileList.length) {
    const answers = await inquirer.getIgnoreFiles(fileList);
    if (answers.ignore.length) {
      fs.writeFileSync(".gitignore", answers.ignore.join("\n"));
    } else {
      touch(".gitignore");
    }
  } else {
    touch(".gitignore");
  }
}

async function setUpRepositoryAsync(repo_url) {
  const status = new Spinner(
    "Initializing local repository and pushing it to remote..."
  );
  status.start();

  //This is where we automate the repetivity git commands
  try {
    git
      .init()
      .then(git.add(".gitignore"))
      .then(git.add("./*"))
      .then(git.commit("Initial git commit"))
      .then(git.addRemote("origin", repo_url))
      .then(git.push("origin", "master"));
  } finally {
    status.stop();
  }
}

module.exports = {
  createRemoteRepository,
  setUpRepositoryAsync,
  createGitignoreFile
};
