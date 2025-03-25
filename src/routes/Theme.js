export const themes = {
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
