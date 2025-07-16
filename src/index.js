import fs from "fs";
import html from "html";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcPath = path.dirname(fileURLToPath(import.meta.url));

const normalize = fs
  .readFileSync(
    path.resolve(srcPath, "../node_modules/normalize.css/normalize.css")
  )
  .toString();

const importSvg = (file, label) =>
  fs.readFileSync(path.resolve(srcPath, "svgs", file)).toString();

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
  Notes: {
    bg: "#fff",
    text: "#001d32",
    "text-secondary": "#97a2aa",
    highlight: "#0093ff",
  },
};

export default function template(items) {
  // const activeThemeName = Object.keys(themes)[5];
  return html`<!DOCTYPE html>
    <html lang="en" data-theme="Notes" id="top">
      <head>
        <meta charset="UTF-8" />
        <title>Jim Nielsen’s Notes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="module"
          src="https://cdn.jim-nielsen.com/shared/jim-site-switcher.js"
        ></script>
        <link rel="icon" href="/favicon.ico" />
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
        <link rel="me" href="https://github.com/jimniels" />
        <link rel="me" href="https://twitter.com/jimniels" />
        <link rel="me" href="https://mastodon.social/@jimniels" />
        <link rel="me" href="https://dribbble.com@jimniels" />

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

          body > header {
            margin: 4rem 0 0;
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

          /*@media screen and (min-width: 600px) {
            body {
              margin: 0 0 0 2rem;
            }
            nav {
              left: 2rem;
            }
          }*/

          nav a {
            border: none !important;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: 0 0 0 10px var(--c-bg);
            background: var(--c-bg);
            transition: 0.3s ease transform;
          }
          nav a:active {
            transform: scale(0.9);
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
        <jim-site-switcher subdomain="notes"></jim-site-switcher>
        <nav>
          <!-- <a href="#js-theme" title="Change theme" aria-label="Change theme"
            >${importSvg("icon-theme.svg")}</a
          > -->
          <a
            href="#${items[Math.floor(Math.random() * items.length)].id}"
            title="Jump to random note"
            aria-label="Jump to random note"
            class="js-shuffle"
          >
            ${importSvg("icon-shuffle.svg")}
          </a>

          <a href="/feed.xml" title="RSS feed" arial-label="RSS feed"
            >${importSvg("icon-rss.svg")}</a
          >
          ${/*Theme({ activeThemeName })}*/ ""}
        </nav>
        <header>
          <h1>Notes</h1>
          <p>
            Note-icing the words of others. Fodder for
            <a href="https://blog.jim-nielsen.com">my blog</a>.
          </p>
          ${importSvg("signature.svg")}
        </header>

        <!-- ${Search(items)} -->
        ${
          /*
    <select>
    ${Object.entries(
    items.reduce((acc, item) => {
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
          ${items
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
                <article
                  id="${id}"
                  ${tags ? html`data-tags="${tags.join(" ")}"` : ""}
                >
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
                        <a href="#${id}"
                          ><time datetime="${date_published}"
                            >${date_published.slice(0, 10)}</time
                          ></a
                        >
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
          // Shuffle jump to link
          const min = 0;
          const max = ${items.length};
          document
            .querySelector(".js-shuffle")
            .addEventListener("click", (e) => {
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

function Search(items) {
  return html`
    <style>
      .search {
        margin: 5rem 0 -1rem;
      }

      .search input {
        width: 100%;
        padding: 0.5rem 1rem;
        background: transparent;
        border: 1px solid var(--c-text-secondary);
        border-radius: 20px;
        color: inherit;
      }
      .search input:hover,
      .search input:focus {
        border-color: var(--c-highlight);
      }
      .search input:focus {
        box-shadow: 0 0 0 2px var(--c-bg), 0 0 0 4px var(--c-highlight);
        outline: 0;
      }
    </style>
    <form id="js-search" class="search">
      <input type="text" placeholder="Search…" list="tags" />

      <datalist id="tags">
        ${items
          .reduce((acc, item) => {
            if (item.tags) {
              item.tags.forEach((tag) => {
                if (!acc.includes(tag)) acc.push(tag);
              });
            }
            return acc;
          }, [])
          .sort()
          .map((tag) => html`<option value="#${tag}"></option>`)}
      </datalist>

      <script>
        document.addEventListener("DOMContentLoaded", fn, false);
        function fn() {
          const $notes = Array.from(document.querySelectorAll("article"));
          console.log("test", $notes);
          document
            .querySelector("#js-search input")
            .addEventListener("input", (e) => {
              const value = e.target.value;
              if (
                value.length === 0 ||
                (value.startsWith("#") && value.length === 1)
              ) {
                $notes.forEach(($note) => {
                  $note.removeAttribute("hidden");
                });
                return;
              }
              if (value.startsWith("#")) {
                $notes.forEach(($note) => {
                  if (
                    $note.dataset.tags &&
                    $note.dataset.tags.includes(e.target.value.slice(1))
                  ) {
                    $note.removeAttribute("hidden");
                  } else {
                    $note.setAttribute("hidden", "hidden");
                  }
                });
              }
            });
        }
      </script>
    </form>
  `;
}

function Theme({ activeThemeName }) {
  return html`
    <style>
      [data-open-theme] .theme {
        top: 0;
      }
      .theme {
        display: flex;
        z-index: 2;
        position: fixed;
        top: -4rem;
        font-size: 0.875rem;
        left: 3rem;
        right: 0;
        background: var(--c-bg);
        padding: 1rem 1rem 0.25rem 3rem;
        overflow: scroll;

        gap: 1.5rem;
        transition: 0.3s ease top;

        scrollbar-width: none;
      }
      .theme::-webkit-scrollbar {
        display: none;
      }
      .theme label {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 2.5rem;
        padding: 0 1rem;
        border: 1px solid transparent;
        position: relative;
        border-radius: 45px;
      }
      .theme label:has(> input:checked) {
        box-shadow: inset 0 0 0 1px var(--c-highlight);
      }
      .theme input {
        display: none;
      }
      .theme ul {
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      .theme ul li {
        width: 18px;
        height: 18px;
        box-shadow: 0 0 0 2px white, 0 0 0 4px var(--c-bg),
          inset 0 0 0 1px rgb(0 0 0 / 10%);
        border-radius: 50%;
      }
    </style>
    <form id="js-theme" class="theme">
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
