import { toString } from "@weborigami/async-tree";
import { marked } from "marked";
import path from "node:path";
import psl from "psl";

export default function mdToData(fileBuffer, fileName) {
  const markdown = toString(fileBuffer);
  return {
    id: path.basename(fileName, ".md"),
    date_published: extractDate(fileName),
    ...convertMdToContentPieces(markdown),
  };
}

function convertMdToContentPieces(markdown) {
  let title = "";
  let external_url = "";
  let html = "";
  let tags = [];

  // Extract `title` and `tags` from the markdown document
  // Then convert everything else to HTML
  //
  // `tags` will (optionally) start the document as a single line of hashtags
  //   #_hashtag #_myThing #_design
  // `title` will be the first <h1> in the document
  //   # Title of my document
  let markdownByLine = markdown.split("\n");
  for (let i = 0; i < markdownByLine.length; i++) {
    let line = markdownByLine[i];

    // If there are tags, split the into an array without the `#`
    // #_html #_css #_js -> ["html", "css", "js"]
    if (/^#_[a-z]/.test(line)) {
      tags = line.split(" ").map((tag) => tag.slice(2));
      // Remove the line
      markdownByLine.splice(i, 1);
    }
    // If it's the <h1>, extract it
    else if (line.startsWith("# ")) {
      const matches = line.match(/# \[(.+?)\]\((.+?)\)/);
      title = matches[1];
      external_url = matches[2];

      // Remove the line
      markdownByLine.splice(i, 1);
      break;
    }
  }

  const _external_url_domain = psl.get(new URL(external_url).hostname);

  // Convert markdown to HTML & get links data
  const markdownSansTagsAndTitle = markdownByLine.join("\n");

  return Object.assign(
    {
      content_html: marked.parse(markdownSansTagsAndTitle),
      title,
      external_url,
      _external_url_domain,
    },
    tags.length > 0 && { tags }
  );
}

function extractDate(id) {
  const [date, time] = id.split("T");
  const dateISO =
    date + "T" + time.slice(0, 2) + ":" + time.slice(2, 4) + "-0600"; // MDT -0600 from zulu
  return new Date(dateISO).toISOString();
}
