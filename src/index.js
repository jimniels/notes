import fs from "fs";
import html from "html";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { themes } from "./routes/Theme.js";
import Document from "./components/Document.js";

const srcPath = path.dirname(fileURLToPath(import.meta.url));

const normalize = fs
  .readFileSync(
    path.resolve(srcPath, "../node_modules/normalize.css/normalize.css")
  )
  .toString();

const importSvg = (file, label) =>
  fs.readFileSync(path.resolve(srcPath, "svgs", file)).toString();

export default function template(items, args = {}) {
  const activeThemeName = Object.keys(themes)[0];

  /** @type {Array<{label: string, href: string}>} */
  const breadcrumbs = args.breadcrumbs || [];

  const children = html`
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
              <p class="domain">
                <a href="/by/link/${_external_url_domain}/">
                  <span class="highlight">${_external_url_domain}</span>
                </a>
              </p>
            </header>
            ${content_html}
            <footer class="de-emphasized">
              <ul>
                <li>
                  🔗
                  <a href="/id/${id}/">
                    <time datetime="${date_published}"
                      >${date_published.slice(0, 10)}</time
                    ></a
                  >
                </li>
                ${tags
                  ? tags.map(
                      (tag) => `<li><a href="/by/tag/${tag}/">#${tag}</a></li>`
                    )
                  : ""}
              </ul>
            </footer>
          </article>
        `
      )
      .join("")}
  `;

  return Document({
    site: { items },
    children,
    breadcrumbs,
  });
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
