// Get data from blog to be reverse time of the order they're in now
// And to also make link tags be "links:Rss"

import fs from "fs";
import path from "path";
import { marked } from "marked";
import psl from "psl";
import feed from "./feed.json" assert { type: "json" };

feed.items.forEach(({ id, content_text }) => {
  fs.writeFileSync(`./notes/${id}.md`, content_text);
});
