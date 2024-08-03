export type Note = {
  id: string;
  content_html: string;
  content_text: string;
  date_published: string;
  title: string;
  url: string;
  external_url: string;
  _external_url_domain: string;
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
