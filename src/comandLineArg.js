const arg = require("arg");

export function parseArgumentsIntoOptions(rawOfArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install"
    },

    {
      arg: rawOfArgs.slice(2)
    }
  );

  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    templete: args._[0],
    runInstall: args["--install"] || false
  };
}
