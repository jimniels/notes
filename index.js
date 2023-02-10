// TODO favicon
// TODO rss xml feed (+ <meta>)
// TODO <meta> feeds from jim-nielsen.com
// TODO blog post

import fs from "fs";
import html from "html";
import { marked } from "marked";
import psl from "psl";
import remoteJsonFeed from "./feed.json" assert { type: "json" };
import jsonfeedToRSS from "jsonfeed-to-rss";

const normalize = fs
  .readFileSync("./node_modules/normalize.css/normalize.css")
  .toString();
const importSvg = (path, label) => fs.readFileSync(path).toString();

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
  WWW: {
    bg: "#fff",
    text: "#000",
    "text-secondary": "#999",
    highlight: "#0000EE",
  },
  Woods: {
    bg: "#fefae0",
    text: "#283618",
    "text-secondary": "#606c38",
    highlight: "#bc6c25",
  },
  Jazz: {
    bg: "#03071e",
    text: "#fff9e8",
    "text-secondary": "#f48c06",
    highlight: "#dc2f02",
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
      // 2022-01-05T1251
      const [date, time] = id.split("T");
      const dateISO =
        date + "T" + time.slice(0, 2) + ":" + time.slice(2, 4) + "-0600"; // MDT -0600 from zulu

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
      console.log("Failed on:", id);
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
// fs.writeFileSync("./build/feed.xml", XMLFeed(jsonFeed));
fs.writeFileSync("./build/feed.xml", jsonfeedToRSS(jsonFeed));

function template(data) {
  const activeThemeName = Object.keys(themes)[0];
  return html`<html lang="en" data-theme="${activeThemeName}" id="top">
    <head>
      <meta charset="UTF-8" />
      <title>Jim Nielsen’s Notes</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="favicon.png" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href="/feed.xml"
      />
      <link
        rel="alternate"
        type="application/json"
        title="JSON Feed"
        href="/feed.json"
      />

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
          transition: 0.1s ease color;
        }
        a:hover {
          color: var(--c-highlight);
          border-bottom: 2px solid var(--c-highlight);
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
          margin: 4rem 0 -1rem;
          position: relative;
        }
        body > header h1 {
          line-height: 1;
          text-indent: 11rem;
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
          position: relative;
          z-index: 1;
        }
        body > header p {
          color: var(--c-text-secondary);
          padding-left: 3rem;
          line-height: 1.3;
        }
        body > header svg {
          position: absolute;
          left: -20px;
          top: -30px;
          fill: var(--c-highlight);
          z-index: 0;
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
          margin-bottom: 5rem;
          padding-top: 5rem; /* enough space when anchoring to a thing */
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

        nav {
          position: sticky;
          top: 0;
          left: 0;
          margin-left: -2rem;
          display: flex;
          gap: 1rem;
          z-index: 10;
          background: var(--c-bg);
          padding: 1rem 0 0.25rem 2rem;
        }
        nav:after {
          content: "";
          position: absolute;
          width: 100%;
          top: 100%;
          left: 0;
          height: 3rem;
          background: linear-gradient(0deg, transparent, var(--c-bg));
          pointer-events: none;
        }

        @media screen and (min-width: 600px) {
          body {
            margin: 0 0 0 2rem;
          }
          nav {
            left: 2rem;
          }
        }

        nav a {
          border: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 0 0 10px var(--c-bg);
          background: var(--c-bg);
        }
        nav a:first-child {
          z-index: 100;
        }

        [data-open-theme] nav > a:first-child svg,
        nav a:hover svg {
          fill: var(--c-highlight);
        }

        nav svg {
          fill: var(--c-text-secondary);
          transition: 0.3s ease fill;
        }
      </style>
    </head>
    <body>
      <nav>
        <a href="#js-theme" title="Change theme" aria-label="Change theme"
          >${importSvg("./icon-theme.svg")}</a
        >
        <a
          href="#${data.items[Math.floor(Math.random() * data.items.length)]
            .id}"
          title="Jump to random note"
          aria-label="Jump to random note"
          class="js-shuffle"
        >
          ${importSvg("./icon-shuffle.svg")}
        </a>
        <a href="#top" title="Jump to top" aria-label="Jump to top"
          >${importSvg("./icon-jump.svg")}</a
        >
        <a href="/feed.xml" title="RSS feed" arial-label="RSS feed"
          >${importSvg("./icon-rss.svg")}</a
        >
        <a href="/feed.json" title="JSON feed" arial-label="JSON feed"
          >${importSvg("./icon-json.svg")}</a
        >
        ${Theme({ activeThemeName })}
      </nav>
      <header>
        <h1>Notes</h1>
        <p>
          Note-icing the words of others. Fodder for
          <a href="https://blog.jim-nielsen.com">my blog</a>.
        </p>
        ${importSvg("./signature.svg")}
      </header>

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
                    ${tags ? tags.map((tag) => `<li>#${tag}</li>`) : ""}
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
    <style>
      [data-open-theme] form {
        top: 0;
      }
      form {
        display: flex;
        z-index: 2;
        position: fixed;
        top: -4rem;
        font-size: 0.875rem;
        left: 3rem;
        right: 0;
        /* border-bottom: 1px solid var(--c-text-secondary); */
        background: var(--c-bg);
        padding: 1rem 1rem 0.25rem 3rem;
        overflow: scroll;

        gap: 1.5rem;
        transition: 0.3s ease top;

        scrollbar-width: none;
      }
      form::-webkit-scrollbar {
        display: none;
      }
      /* form:after {
        content: "";
        background: linear-gradient(90deg, var(--c-bg), transparent);
        height: 1rem;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
      } */
      form label {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 2.5rem;
        padding: 0 1rem;
        border: 1px solid transparent;
        position: relative;
        border-radius: 45px;
      }
      /* form label:before {
        content: "";
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid transparent;

        position: absolute;
        left: 50%;
        top: 0;
      } */
      form label:has(> input:checked) {
        box-shadow: inset 0 0 0 1px var(--c-highlight);
      }
      form input {
        display: none;
      }
      form span {
      }
      form ul {
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      form ul li {
        width: 18px;
        height: 18px;
        box-shadow: 0 0 0 2px white, 0 0 0 4px var(--c-bg),
          inset 0 0 0 1px rgb(0 0 0 / 10%);
        border-radius: 50%;
      }
    </style>
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
            <span>${name}</span>
            <ul>
              ${Object.values(colors).map(
                (value) => html`<li style="background-color: ${value}"></li>`
              )}
            </ul>
          </label>`
        )
        .join("")}
    </form>

    <script>
      // Initial page load
      const theme = localStorage.getItem("theme");
      const defaultTheme = "${activeThemeName}";
      if (!theme) {
        localStorage.setItem("theme", defaultTheme);
      } else if (theme !== defaultTheme) {
        localStorage.setItem("theme", theme);
        document.documentElement.dataset.theme = theme;
        document.querySelector(
          "input[name=theme][value='" + theme + "']"
        ).checked = true;
      }

      // Setup listener on change
      document.querySelector("#js-theme").addEventListener("change", (e) => {
        const activeTheme = e.target.value;
        document.documentElement.setAttribute("data-theme", activeTheme);
        localStorage.setItem("theme", activeTheme);
      });

      document.querySelector("#js-theme").addEventListener("click", (e) => {
        e.stopPropagation();
      });

      // Navigation theme
      document.addEventListener("click", (e) => {
        console.log(document.documentElement.dataset.openTheme);
        if (document.documentElement.dataset.openTheme === "true") {
          document.documentElement.removeAttribute("data-open-theme");
        }
      });
      /*
      document.querySelector("#js-theme").addEventListener("click", (e) => {
        e.stopPropagation();
      });*/
      document
        .querySelector("a[href*='js-theme']")
        .addEventListener("click", (e) => {
          console.log("clicked");
          const isOpen = document.documentElement.dataset.openTheme;
          if (isOpen) {
            document.documentElement.removeAttribute("data-open-theme");
          } else {
            document.documentElement.setAttribute("data-open-theme", "true");
          }
          e.stopPropagation();
        });
    </script>
  `;
}
