// Node
import { readFileSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { cwd } from "node:process";

// Mustache
import Mustache from "mustache";

const port = 3092;

/** Generated Static Files */
const getStaticFiles = () => {
  const assetsDir = resolve(cwd(), "assets");

  // Reading the static file directory
  const files = readdirSync(assetsDir);

  /** @type {Map<string, { content: string, contentType: string, filename: string }>} */
  const mappedFiles = new Map();

  /** @type {string[]} */
  const scripts = [];

  /** @type {string[]} */
  const stylesheets = [];

  files.forEach((filename) => {
    // Getting the file type
    const type = filename.endsWith("js")
      ? "scripts"
      : filename.endsWith("css")
      ? "stylesheets"
      : undefined;

    // Appending the file to it's group type
    switch (type) {
      case "scripts": {
        scripts.push("/assets/" + filename);
        break;
      }
      case "stylesheets": {
        stylesheets.push("/assets/" + filename);
        break;
      }
      default:
        return;
    }

    // Reading the files contents
    const content = readFileSync(resolve(assetsDir, filename), "utf-8");

    // Adding the file to map
    mappedFiles.set(filename, {
      filename,
      content,
      contentType: filename.endsWith("js")
        ? "application/javascript"
        : filename.endsWith("css")
        ? "text/css"
        : "text/plain",
    });
  });

  return { mappedFiles, scripts, stylesheets };
};

/** Generated The page render time at the server */
const getRenderTime = () => {
  const date = new Date();

  const renderTime = `${date.getUTCHours().toString().padStart(2, "0")}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${date
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}:${date
    .getUTCMilliseconds()
    .toString()
    .padStart(2, "0")}`;

  return renderTime;
};

const { mappedFiles, scripts, stylesheets } = getStaticFiles();

// Reading the HTML template
const htmlTemplateAddress = resolve(cwd(), "templates", "index.html");
const htmlTemplate = readFileSync(htmlTemplateAddress, "utf-8");

const server = createServer(async (req, res) => {
  const pathname = req.url;

  if (pathname === "/") {
    // Fetching the needed data from the original API
    const fetchedData = await fetch("http://localhost:3090").then((res) =>
      res.json()
    );

    // Applying the data to HTML template
    const indexPage = Mustache.render(htmlTemplate, {
      stylesheets,
      scripts,
      inlineScripts: [
        `var embeddedCitiesData = ${JSON.stringify(fetchedData)};`,
        `var embeddedRenderedTime = { renderTime: "${getRenderTime()}" };`,
      ],
    });

    // Returning the page
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(indexPage);

    return;
  }

  // Checking if the request path is in the `scripts` or `stylesheets`
  if (scripts.includes(pathname) || stylesheets.includes(pathname)) {
    // Getting the key from pathname
    const key = pathname?.replace("/assets/", "").replaceAll("/", "");

    // Checking if the key is valid
    if (mappedFiles.has(key)) {
      // Getting the item from the map
      const { content, contentType } = mappedFiles.get(key);

      // Returning the item
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      res.end(content);

      return;
    }
  }

  // Returning 404 if there wasn't any matched item
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.end("404");
});

server.listen(port, () => {
  console.log(
    `🔥 Node-Server running at \x1b[32mhttp://localhost:${port}\x1b[0m`
  );
});
