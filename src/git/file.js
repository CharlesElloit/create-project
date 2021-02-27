const fs = require("fs");
const path = require("path");

function getCurrentRootDirectory() {
  return path.basename(process.cwd());
}

function isDirectoryExists(folderPath) {
  return fs.existsSync(folderPath);
}

module.exports = {
  getCurrentRootDirectory,
  isDirectoryExists
};
