# [notes.jim-nielsen.com](https://notes.jim-nielsen.com)

- Build: `npm run build`
- Development: `npm start`

## How it works

Each "post" is a markdown file. File names follow this format: `YYYY-MM-DDTHHMM.md`. Examples:

- New files:
  - `2023-08-01T1036.md`
  - `2023-08-05T1222.md`
- Ported "reading notes" are:
  - `2022-01-12T1230.md`
  - `2022-01-12T1229.md`
  - `2022-01-12T1228.md`

Each markdown file follows this pattern (tags optional but prefixed with `_` to differentiate them in iA Writer from [my blog’s](https://blog.jim-nielsen.com) posts). **No exceptions.**

```md
#\_article #\_twitter #\_rss

# [Name of the article I link to](https://example.com/path/to/article)

I liked this excerpt:

> Lorem ipsum santa dolor
```

Each markdown file gets parsed into a JSON feed item:

```js
[
  {
    // Filename (minus extension)
    id: "2022-01-08T0905",

    // <h1> stripped from markup and extracted into `title` and `external_url`
    title: "Name of article I link to",
    external_url: "https://example.com/..."

    // Body of markdown gets converted to HTML
    content_html: "<p>I liked this..."

    // Other meta info (derived from file name/structure)
    date_published: "2022-01-08T09:05-06:00"
    url: "https://notes.jim-nielsen.com/#2022-01-08T0905",
    tags: ["article", "twitter", "rss"]
  }
]
```

And then templates produce the `index.html` file (along with an XML and JSON feed).

## Notes to self

The very first file (post) on `notes.jim-nielsen.com` was `2023-02-02T2100.md`. All files _before_ that were ported from my old blog’s reading notes.
