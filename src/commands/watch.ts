import chokidar from "chokidar";
import { exec } from "child_process";
import debounce from "lodash.debounce";
import { resolveRepos } from "../lib/resolveRepos.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

const runWatchCommand = async (onChangeCmd?: string) => {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(undefined, config.repos || []);
  const p = print(config.theme);

  if (!onChangeCmd) {
    p.fail("Missing --on-change option.");
    return;
  }

  if (!repos.length) {
    p.fail("No Git repositories found.");
    return;
  }

  const watcher = chokidar.watch(
    repos.map((r) => `${r}/**/*.{js,ts,md}`),
    {
      ignoreInitial: true,
      ignored: /node_modules|\.git/,
    }
  );

  p.info(`Watching ${repos.length} repositories...`);
  p.info(`On change: ${onChangeCmd}`);

  const runOnChange = debounce(() => {
    p.info("📦 Change detected. Executing command...");

    const fullCommand = `gitter ${onChangeCmd}`;
    exec(fullCommand, (err, stdout, stderr) => {
      if (err) {
        p.fail(` Error: ${err.message}`);
        return;
      }
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    });
  }, 1000);

  watcher.on("change", (filePath) => {
    p.cmd(`✏️ File changed: ${filePath}`);
    runOnChange();
  });
};

export default function registerWatchCommand(program: Command) {
  program
    .command("watch")
    .description("Watch for file changes in repos and run a command")
    .option(
      "--on-change <cmd>",
      "Command to run on file change (e.g. 'commit --auto && push origin main')"
    )
    .action((options: { onChange?: string }) => {
      runWatchCommand(options.onChange);
    });
}
