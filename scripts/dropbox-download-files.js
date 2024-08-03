import fs from "node:fs";
import { getFiles } from "./dropbox.js";

getFiles("/notes").then((files) => {
  fs.mkdirSync("./notez", { recursive: true });
  Object.entries(files).forEach(([key, contents]) => {
    fs.writeFileSync(`./notez/${key}`, contents);
  });
  console.log("Files downloaded!");
});
