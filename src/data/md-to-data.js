// @ts-check
import { toString } from "@weborigami/async-tree";
import { marked } from "marked";
import path from "node:path";
import { parse } from "tldts";

/**
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @returns {import("../../types").Note}
 */
export default function md_to_data(fileBuffer, fileName) {
  const markdown = toString(fileBuffer);
  const id = path.basename(fileName, ".md");
  const date_published = extractDate(id);
  const url = `https://notes.jim-nielsen.com/#${id}`;

  let title = "";
  let tags = undefined;
  let external_url = "";
  // For debugging
  let matches = null;
  let matchedLine = null;

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
      matches = line.match(/# \[(.+?)\]\((.+?)\)/);
      if (matches === null) {
        throw new Error(
          `<h1> could not be extracted from markdown file: ${id}`
        );
      }
      title = matches[1];
      external_url = matches[2];

      // Remove the line
      matchedLine = line;
      markdownByLine.splice(i, 1);
      break;
    }
  }

  if (!external_url) {
    throw new Error(
      [
        `The external_url for this note could not be extracted from the markdown file`,
        `  file: ${id}`,
        `  line: ${matchedLine}`,
        `  matches: ${matches}`,
        `  markdown: ${markdown}`,
      ].join("\n")
    );
  }
  const result = parse(external_url);
  const { domain: _external_url_domain } = result;
  if (!_external_url_domain) {
    throw new Error(
      `The domain for this note could not be extracted from the markdown file: ${id}`
    );
  }

  // Convert markdown to HTML & get links data
  const markdownSansTagsAndTitle = markdownByLine.join("\n");
  const content_html = marked.parse(markdownSansTagsAndTitle) || "";

  /** @type {import("../types").Note} */
  const note = {
    content_html,
    date_published,
    id,
    url,
    tags,
    title,
    external_url,
    _external_url_domain,
  };
  return note;
}

/**
 * @param {string} id - Should be in the format of `2021-08-01T1200`
 * @returns {string} - ISO 8601 date string
 */
function extractDate(id) {
  const [date, time] = id.split("T");
  const dateISO =
    date + "T" + time.slice(0, 2) + ":" + time.slice(2, 4) + "-0600"; // MDT -0600 from zulu
  return new Date(dateISO).toISOString();
}
