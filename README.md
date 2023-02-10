# [links.jim-nielsen.com](https://links.jim-nielsen.com)

- `npm run build`

## Content format

All content follows this pattern (tags optional but prefixed with `n_`). **No exceptions.**

```md
#l_article #l_twitter #l_rss

# [Five years of quitting Twitter](https://nolanlawson.com/2022/02/02/five-years-of-quitting-twitter/)

I liked this:

> [for many] I only exist when someone takes pity on me and links to my blog from Twitter, Reddit, Hacker News, or a big site like CSS Tricks...
>
> For those people who are re-sharing my content on social media, I suspect most of them found it from their RSS feed. So RSS definitely still seems alive and well, even if it’s just a small upstream tributary for the roaring downstream river of Twitter, Reddit, etc
```

Which gets parsed into a JSON feed item:

```js
[
  {
    // Filename
    id: "2022-01-08T0905",
    // <h1> stripped from markup and extracted into `title` and `external_url`
    content_html: "<p>I liked this..."
    date_published: "2022-01-08T09:05-07:00"
    title: "Five years of quitting twiter"
    url: "https://notes.jim-nielsen.com/#2022-01-08T0905",
    external_url: "https://example.com/..."
    tags: ["article", "twitter", "rss"]
  }
]
```

## File names

- Ported reading notes:
  - `2022-01-12T1230.md`
  - `2022-01-12T1229.md`
  - `2022-01-12T1228.md`
- New files
  - `2023-08-01T1036.md`
  - `2023-08-05T1222.md`

## URLs

Load them all in one giant HTML file on `notes.jim-nielsen.com`

Why one big file? Because I want to be able to search/filter them all at once and one page makes that easy. Plus the exercise here is all text so it should be small.

Accessible as anchor link in main file:

- `notes.jim-nielsen.com/#2022-05-01T1200`

Or as its own URL

- `notes.jim-nielsen.com/2022-05-01T1200`

Will require:

1. Port all exisiting reading notes into new repository as `.md` files
2. Script that gets all files, parses them into `db.json` file, and turns them into static files (and feed files)
3. Add a thing to all reading notes posts that indicate they are now reposted on `notes.jim-nielsen.com` — or do a redirect? from old blog reading notes posts to new `notes.jim-nielsen.com` - this might be a little weird...
4.
