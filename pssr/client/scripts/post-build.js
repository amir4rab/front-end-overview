import { resolve } from "node:path";
import {
  readdirSync,
  cpSync,
  existsSync,
  rmdirSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { cwd, stdin, stdout } from "node:process";
import Readline from "node:readline/promises";

/** Start time for the script */
const startTime = performance.now();

const readline = Readline.createInterface({
  input: stdin,
  output: stdout,
});

// Resolving targeted directories
const parentDir = resolve(cwd(), "..");
const assetsSource = resolve(cwd(), "dist", "assets");
const publicSource = resolve(cwd(), "public");

(async () => {
  // Erroring out incase the dist directory doesn't exits
  if (!existsSync(assetsSource)) {
    console.error(
      "\x1b[31mPlease run this script after building the client application!\x1b[0m\n"
    );
    throw new Error("dist/ does't exits!\n");
  }

  const parentDirDirectories = readdirSync(parentDir, "utf-8").filter(
    (directory) => directory !== "client"
  );

  // Logging the distentions
  console.log(`
Coping the client code to the following locations:\n
${parentDirDirectories.map((dir) => `\t/${dir}/assets/\n`).join("")}
  `);

  // Checking with the user, weather they like to continue the operation
  const askingTimeStart = performance.now();
  const input = await readline.question("Would you like to continue? [Y/n] ");
  readline.close();
  const askingTimeTotal = performance.now() - askingTimeStart;

  // Stopping the script incase they didn't like to continue
  if (input !== "" && input.toLocaleLowerCase() !== "y") {
    console.log(`\n\x1b[33mStopping the "post-build" script...\x1b[0m\n`);
    return "";
  }

  parentDirDirectories.forEach((dir) => {
    const distRoot = resolve(parentDir, dir);
    const distAssets = resolve(distRoot, "assets");

    // Removing assets dir incase it exits
    if (existsSync(distAssets))
      rmSync(distAssets, { recursive: true, force: true });

    // Creating assets dir
    mkdirSync(distAssets);

    // Coping files
    cpSync(assetsSource, distAssets, { recursive: true });
    cpSync(publicSource, distAssets, { recursive: true });
  });

  const totalTime = performance.now() - startTime - askingTimeTotal;
  console.log(
    `\n\x1b[32mSuccessfully completed the post-build script in ${totalTime.toFixed(
      2
    )}ms\x1b[0m`
  );
})();
