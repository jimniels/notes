// Matches json feed schema:
// https://www.jsonfeed.org/version/1.1/
export type Site = {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  items: Array<Note>;
};

export type Note = {
  content_html: string;
  date_published: string;
  external_url: string;
  _external_url_domain: string;
  id: string;
  title: string;
  url: string;
  tags?: Array<string>;
};

type ThemesById = {
  [themeName: string]: Theme;
};

export type Theme = {
  bg: string;
  text: string;
  "text-secondary": string;
  highlight: string;
};
