import fs from "fs";
import html from "html";
import { marked } from "marked";
import psl from "psl";
import remoteJsonFeed from "./feed.json" assert { type: "json" };
const normalize = fs
  .readFileSync("./node_modules/normalize.css/normalize.css")
  .toString();
const importSvg = (path) => fs.readFileSync(path).toString();

const themes = {
  Yamble: {
    bg: "#00171f",
    text: "#ffffff",
    "text-secondary": "#007ea7",
    highlight: "#00a8e8",
  },
  Halloween: {
    bg: "#252422",
    text: "#fffcf2",
    "text-secondary": "#ccc5b9",
    highlight: "#eb5e28",
  },
  Cadete: {
    bg: "#2b2d42",
    text: "#edf2f4",
    "text-secondary": "#8d99ae",
    highlight: "#ef233c",
  },
  Zizzoo: {
    bg: "#000000",
    text: "#ffffff",
    "text-secondary": "#999",
    highlight: "#fca311",
  },
  Valentines: {
    bg: "#590d22",
    text: "#fff0f3",
    "text-secondary": "#ff8fa3",
    highlight: "#ff4d6d",
  },
  Platnak: {
    bg: "#ffffff",
    text: "#326273",
    "text-secondary": "#5c9ead",
    highlight: "#e39774",
  },
  WWW: {
    bg: "#fff",
    text: "#000",
    "text-secondary": "#999",
    highlight: "#0000EE",
  },
};

const localContent = fs
  .readdirSync("./notes")
  .filter((file) => file.endsWith(".md"))
  .reverse()
  .map((file) => {
    const id = file.split(".")[0];
    const md = fs.readFileSync(`./notes/${file}`).toString();
    return [id, md];
  });
const remoteContent = remoteJsonFeed.items.map(({ id, content_text }) => [
  id,
  content_text,
]);

let jsonFeed = {
  version: "https://jsonfeed.org/version/1",
  title: "Jim Nielsen’s Blog Reading Notes",
  home_page_url: "https://notes.jim-nielsen.com",
  feed_url: "https://notes.jim-nielsen.com/feed.json",
  items: [...localContent, ...remoteContent].map(([id, md]) => {
    try {
      let dateISO = id.split("");
      dateISO[id.lastIndexOf("-")] = ":";
      dateISO = dateISO.join("") + "-0600"; // MDT -0600 from zulu

      const { title, external_url, content_html, tags } =
        convertMdToContentPieces(md);

      return {
        id,
        content_html,
        date_published: new Date(dateISO).toISOString(),
        title,
        url: `https://notes.jim-nielsen.com/#${id}`,
        external_url,
        _external_url_domain: psl.get(new URL(external_url).hostname),
        ...(tags.length ? { tags } : {}),
      };
    } catch (e) {
      console.log("Failed on:", file);
      console.log(e);
    }
  }),
};

fs.writeFileSync(
  "./build/feed.json",
  JSON.stringify(
    {
      ...jsonFeed,
      items: jsonFeed.items.slice(0, 20).map((item) => {
        // Filter out any key/value pairs that start with "_" because that's proprietary to us here
        const keys = Object.keys(item);
        return keys
          .filter((key) => !key.startsWith("_"))
          .reduce((acc, key) => ({ ...acc, [key]: item[key] }), {});
      }),
    },
    null,
    2
  )
);
fs.writeFileSync("./build/index.html", template(jsonFeed));

function template(data) {
  const activeThemeName = Object.keys(themes)[0];
  return html`<html lang="en" data-theme="${activeThemeName}">
    <head>
      <meta charset="UTF-8" />
      <title>Jim Nielsen’s Notes</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="favicon.png" />

      <style>
        ${normalize}
          ${Object.entries(themes).map(
            ([name, colors]) => html`
              :root[data-theme="${name}"] {
              ${Object.entries(colors).map(
                ([key, value]) => `--c-${key}: ${value};`
              )}
              }
            `
          )}
          html {
          background: var(--c-bg);
          scroll-behavior: smooth;
        }

        html,
        body {
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

        a {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid;
        }
        a:hover {
          background: var(--c-highlight);
          color: var(--c-text);
        }

        pre {
          overflow: scroll;
        }

        article > header > p {
          color: var(--c-text-secondary);
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.05rem;
          margin-bottom: 0;
        }
        article > footer {
          color: var(--c-text-secondary);
          font-size: 0.8125rem;
          margin-bottom: 0;
        }
        article > footer > ul {
          display: flex;
          list-style-type: none;
          gap: 0.5rem;
          padding: 0;
        }
        article > footer > ul li:not(:last-child):after {
          content: " · ";
          padding: 0 0.25rem;
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
          width: 0.25rem;
          height: 1.25em;
          background-color: var(--c-highlight);
          display: inline-block;
          position: relative;
          top: 0.2em;
          animation: 1s blink step-end infinite;
        }
        body > header > :is(h1, p) {
          margin: 0.5rem 0;
        }
        body > header p {
          color: var(--c-text-secondary);
        }
        @keyframes blink {
          from,
          to {
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
          border-left: 1px solid var(--c-highlight);
          margin: 0;
          padding-left: calc(1.618rem / 2);
        }
        article {
          margin-bottom: 8rem;
          padding-top: 2.5rem;
          overflow-wrap: break-word;
        }

        body > footer {
          margin: calc(100vh - 6rem) 0 2rem;
          color: var(--c-text-secondary);
          font-size: 0.75rem;
        }

        .highlight {
          color: var(--c-highlight);
        }

        nav a {
          border: none;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--c-text-secondary);
        }

        nav svg {
          fill: var(--c-bg);
        }

        nav {
          position: fixed;
          bottom: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
          width: fit-content;
        }

        @media screen and (min-width: 600px) {
          body {
            margin: 0 0 0 6rem;
          }
          nav {
            left: 0;
            top: 3rem;
          }
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Jim Nielsen’s Notes</h1>
        <p>
          Stuff that strikes me as interesting. Fodder for
          <a href="https://blog.jim-nielsen.com">my blog</a>.
        </p>

        <nav>
          <a
            href="#${data.items[Math.floor(Math.random() * data.items.length)]
              .id}"
            title="Jump to random note"
            class="js-shuffle"
          >
            ${importSvg("./icon-shuffle.svg")}
          </a>
          <a href="/feed.xml" title="RSS Feed"
            >${importSvg("./icon-rss.svg")}</a
          >
          <a href="/feed.json" title="JSON Feed"
            >${importSvg("./icon-json.svg")}</a
          >
        </nav>
      </header>

      ${/*Theme({ activeThemeName })*/ ""}
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
              tags,
            }) => html`
              <article id="${id}">
                <header>
                  <h1><a href="${external_url}">${title}</a></h1>
                  <p class="byline">
                    <span class="highlight">${_external_url_domain}</span>
                  </p>
                </header>
                ${content_html}
                <footer class="de-emphasized">
                  <ul>
                    <li>
                      <time datetime="${date_published}">
                        ${date_published.slice(0, 10)}
                      </time>
                    </li>
                    ${tags.length ? tags.map((tag) => `<li>#${tag}</li>`) : ""}
                  </ul>
                </footer>
              </article>
            `
          )
          .join("")}
      </main>
      <footer>
        Holy cow, you made it all the way to the bottom? Look at you 👏
        <br />
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          >Here’s a special gift.</a
        >
      </footer>

      <script>
        const min = 0;
        const max = ${data.items.length};
        document.querySelector(".js-shuffle").addEventListener("click", (e) => {
          e.preventDefault();
          const rand = Math.floor(Math.random() * max) + min;
          Array.from(document.querySelectorAll("article"))[
            rand
          ].scrollIntoView();
        });
      </script>
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

  // Convert markdown to HTML & get links data
  const markdownSansTagsAndTitle = markdownByLine.join("\n");

  return {
    content_html: marked.parse(markdownSansTagsAndTitle),
    title,
    external_url,
    tags,
  };
}

function Theme({ activeThemeName }) {
  return html`
    <form id="js-theme">
      ${Object.entries(themes)
        .map(
          ([name, colors]) => html`<label>
            <input
              type="radio"
              name="theme"
              value="${name}"
              ${name === activeThemeName && "checked"}
            />
            ${name}
            <ul style="display: flex; list-style-type: none;">
              ${Object.values(colors).map(
                (value) => html`<li
                  style="
                width: 24px;
                height: 24px;
                background-color: ${value};
                box-shadow: 0 0 0 2px white;
                border-radius: 50%;"
                ></li>`
              )}
            </ul>
          </label>`
        )
        .join("")}
    </form>

    <script>
      const t = ${JSON.stringify(themes)};
      document.querySelector("#js-theme").addEventListener("change", (e) => {
        const activeTheme = e.target.value;
        document.documentElement.setAttribute("data-theme", activeTheme);
      });
    </script>
  `;
}
