import fs from "fs";
import html from "html";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { themes } from "../routes/Theme.js";

const srcPath = path.dirname(fileURLToPath(import.meta.url));

const normalize = fs
  .readFileSync(
    path.resolve(srcPath, "../../node_modules/normalize.css/normalize.css")
  )
  .toString();

const importSvg = (file, label) =>
  fs.readFileSync(path.resolve(srcPath, "../svgs", file)).toString();

/**
 *
 * @param {{
 *   site: import("../../types").Site,
 *   children: string,
 *   breadcrumbs?: Array<{label: string, href: string}>,
 * }} args
 * @returns
 */
export default function Document({ site, children, breadcrumbs }) {
  const { items } = site;
  const activeThemeName = Object.keys(themes)[0];
  const randomNoteId =
    site.items[Math.floor(Math.random() * site.items.length)].id;

  return html`<!DOCTYPE html>
    <html lang="en" data-theme="${activeThemeName}" id="top">
      <head>
        <meta charset="UTF-8" />
        <title>Jim Nielsen’s Notes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="module"
          src="https://www.jim-nielsen.com/jim-navbar.js"
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
        </style>
        <link rel="stylesheet" href="/styles.css" />
        <style>
          ${Object.entries(themes).map(
            ([name, colors]) => html`
              :root[data-theme="${name}"] {
              ${Object.entries(colors).map(
                ([key, value]) => `--c-${key}: ${value};`
              )}
              }
            `
          )}
        </style>
      </head>
      <body>
        <jim-navbar></jim-navbar>
        <nav>
          <!-- <a href="/" title="Home" aria-label="Home" aria-current=""
            >${importSvg("icon-home.svg")}</a
          > -->
          <a href="#js-theme" title="Change theme" aria-label="Change theme"
            >${importSvg("icon-theme.svg")}</a
          >
          <a
            href="/by/id/${randomNoteId}"
            title="Jump to random note"
            aria-label="Jump to random note"
            class="js-shuffle"
          >
            ${importSvg("icon-shuffle.svg")}
          </a>
          <a href="/feed.xml" title="RSS feed" arial-label="RSS feed"
            >${importSvg("icon-rss.svg")}</a
          >
          <a href="/about/" title="About" aria-label="About" aria-current=""
            >${importSvg("icon-about.svg")}</a
          >
          ${Theme({ activeThemeName })}
        </nav>
        <ul class="breadcrumbs">
          ${breadcrumbs.length > 0
            ? html`<li>
                  <a href="/">Notes</a>
                </li>
                ${breadcrumbs.map(
                  ({ label, href }, i) => html`
                    <li>
                      <a
                        href="${href}"
                        ${i === breadcrumbs.length - 1
                          ? "aria-current='page'"
                          : ""}
                        >${label}</a
                      >
                    </li>
                  `
                )}`
            : html` <li><a href="/" aria-current="page">Notes</a></li> `}
        </ul>

        <main>${children}</main>
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

function Theme({ activeThemeName }) {
  return html`
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
    </script>
  `;
}
