import fs from "fs";
import path from "path";
import { marked } from "marked";
import psl from "psl";
// import json from "./build/feed.json" assert { type: "json" };
const normalize = fs.readFileSync("./build/normalize.css").toString();

const feedItems = fs
  .readdirSync("./notes")
  .filter((file) => file.endsWith(".md"))
  .reverse()
  .map((file) => {
    try {
      const id = file.split(".")[0];

      let dateISO = id.split("");
      dateISO[id.lastIndexOf("-")] = ":";
      dateISO = dateISO.join("") + "-0600"; // MDT -0600 from zulu

      const md = fs.readFileSync(path.join("./notes", file)).toString();
      const { title, external_url, content_html, tags } =
        convertMdToContentPieces(md);

      return {
        id,
        content_html,
        date_published: new Date(dateISO).toISOString(), // TODO MST
        title,
        url: `https://notes.jim-nielsen.com/${id}`,
        external_url,
        _external_url_domain: psl.get(new URL(external_url).hostname),
        ...(tags.length ? { tags } : {}),
      };
    } catch (e) {
      console.log("Failed on:", file);
      console.log(e);
    }
  });

// In theory, this will be the data that we get when we pull in each markdown
// file. So from here, we'll have to add what else we need.
// const enrichedJson = {
//   ...json,
//   items: json.items
//     .map((item) => {
//       let newItem = {};
//       try {
//         const [heading, ...mdLines] = item.content_text.split("\n");
//         newItem = {
//           ...item,
//           content_html: marked.parse(mdLines.join("\n")),

//         };
//         return newItem;
//       } catch (e) {
//         console.log("Failed for", item.title);
//         console.log(e);
//         return item;
//       }
//     })
//     .concat(feedItems),
// };

fs.writeFileSync("./build/index.html", template({ items: feedItems }));

function template(data) {
  return /*html*/ `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Jim Nielsen’s Notes</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" href="favicon.png" />

    <style>
      ${normalize}
      :root {
        --c-highlight: hsl(200 100% 50%);

        --c-bg: hsl(0 0% 100%);
        --c-fg: hsl(0 0% 97%);
        --c-text-dark: hsl(0 0% 0%);
        --c-text: hsl(0 0% 20%);
        --c-text-light: hsl(0 0% 50%);
      }
      @media screen and (prefers-color-scheme: dark) {
        :root {
          --c-bg: hsl(0 0% 10%);
          --c-fg: hsl(0 0% 13%);
          --c-text-dark: hsl(0 0% 100%);
          --c-text: hsl(0 0% 85%);
          --c-text-light: hsl(0 0% 70%);
        }
      }
      
      html {
        background: var(--c-bg);
      }
      html, body {
        font-size: 1em;
      }
      body {
        font-family: Verdana, "Helvetica Neue", sans-serif;
        line-height: 1.5;
        max-width: 30rem;
        width: 90%;
        margin: 0 auto;
        color: var(--c-text);
      }
      @media screen and (min-width: 600px) {
        body {
          margin: 0 0 0 calc(1.618rem * 3);
        }
        /* body:before {
          content: "";
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          left: 50%;
          background: var(--c-fg);
        } */
      }
      a {
        color: inherit;
        text-decoration: none;
        border-bottom: 1px solid;
      }
      a:hover {
        color: var(--c-text-dark);
        background: var(--c-fg);
      }
      article {
        font-size: .875rem;
      }
      
      .byline {
        color: var(--c-text-light);
        font-size: .8125rem;
        text-transform: uppercase;
        letter-spacing: .05rem;
        margin-bottom: 0;
        font-size: .75rem;

      }
      time a {
        border-bottom: none;
      }
      time a:hover {
        opacity: 0.75;
        border-bottom: 1px solid;
      }
      body > header {
        margin: 4rem 0 5rem;
        position: relative;
      }
      body > header h1 {
        line-height: 1;
      }
      body > header h1:after {
        content: "";
        width: .25rem;
        height: 1.25em;
        background-color: var(--c-highlight);
        display: inline-block;
        position: relative;
        top: .2em;
        animation: 1s blink step-end infinite;
      }
      body > header > * {
        margin: .5rem 0;
      }
      body > header p {
        color: var(--c-text-light);
      }
      @keyframes blink {
        from, to {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }
      
      article header {
        display: flex;
        flex-direction: column;
      }
      article header h1 {
        order: 2;
      }
      article h1 {
        text-transform: uppercase;
        letter-spacing: 0.0125rem;
      }
      article :is(h1, h2, h3, h4) {
        font-size: 1rem;
      }
      blockquote {
        border-left: 1px solid var(--c-text-light);
        margin: 0;
        padding-left: calc(1.618rem / 2);
      }
      article {
        margin-bottom: calc(1.618rem * 3);
      }

      svg {
        display: block;
        margin: calc(1.618rem * 1.5) 0 calc(1.618rem * 3);
      }
      
      footer {
        margin: 120px 0 10px;
        opacity: 0.5;
        font-size: 0.75rem;
      }
    </style>
  </head>
  <body>
    
    <header>
      <h1>Jim Nielsen’s Notes</h1>
      <p>Stuff that strikes me as interesting. Fodder for <a href="https://blog.jim-nielsen.com">my blog</a>.</p>

      <nav>
        <a
          href="#${
            data.items[Math.floor(Math.random() * data.items.length) + 20].id
          }"
          title="Shuffle"
          class="js-shuffle">
          Shuffle
        </a>
        <a href="/feed.xml">RSS Feed</a>
        <a href="/feed.json">JSON Feed</a>
      </nav>
    </header>
    
    <script>
      const min = 20;
      const max = ${data.items.length};
      document.querySelector(".js-shuffle").addEventListener("click", (e) => {
        e.preventDefault();
        const rand = Math.floor(Math.random() * max) + min;
        Array.from(document.querySelectorAll('article'))[rand].scrollIntoView();
      });
    </script>
    
    ${
      /*
    <select>
    ${Object.entries(
      data.items.reduce((acc, item) => {
        if (acc[item._external_url_domain]) {
          acc[item._external_url_domain]++;
        } else {
          acc[item._external_url_domain] = 1;
        }
        return acc;
      }, {})
    )
      .sort(([domainA, countA], [domainB, countB]) =>
        countA < countB ? 1 : countA > countB ? -1 : 0
      )
      .map(
        ([domain, count]) =>
          `<option value="${count}">${domain} (${count})</option>`
      )}
    </select>*/ ""
    }
    <main>
    ${data.items
      .map(
        ({
          id,
          content_html,
          content_text,
          date_published,
          title,
          url,
          external_url,
          _external_url_domain,
        }) => /*html*/ `
        <article id="${id}">
          
          <header>
            <h1><a href="${external_url}">${title}</a></h1>
            <p class="byline">
            <span>${_external_url_domain}</span> · <time datetime="${date_published}">${date_published.slice(
          0,
          10
        )}</time>
          </p>
          </header>
          ${content_html}
        </article>
    `
      )
      .join("")}
      
    </main>
    <footer>
      Holy cow, you made it all the way to the bottom? Look at you 👏
    </footer>
  </body>
</html>`;
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
  //   #hashtag #myThing #design
  // `title` will be the first <h1> in the document
  //   # Title of my document
  let markdownByLine = markdown.split("\n");
  for (let i = 0; i < markdownByLine.length; i++) {
    let line = markdownByLine[i];

    // If there are tags, split the into an array without the `#`
    // #html #css #js -> ["html", "css", "js"]
    if (/^#[a-z]/.test(line)) {
      tags = line.split(" ").map((tag) => tag.slice(1));
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

  // Convert markdown to HTML & get links data
  const markdownSansTagsAndTitle = markdownByLine.join("\n");

  return {
    content_html: marked.parse(markdownSansTagsAndTitle),
    title,
    external_url,
    tags,
  };
}
