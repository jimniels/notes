/*

NOTES TO SELF:

Access tokens to the Dropbox API are no longer long lived.

So you have to get a refresh token (which _is_ long lived) and that will let
you get an access token anytime you need one.

https://dropbox.tech/developers/migrating-app-permissions-and-access-tokens#updating-access-token-type

So, to do this:

1. Put this in a browser URL bar (with your app-specific values from the Dropbox console):

https://www.dropbox.com/oauth2/authorize?client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>&response_type=code&token_access_type=offline

2. Get the `code` that it returns in the URL and put it here:

```
curl https://api.dropbox.com/oauth2/token \
    -d code=<CODE> \
    -d grant_type=authorization_code \
    -d redirect_uri=<REDIRECT_URI> \
    -u <APP_KEY>:<APP_SECRET>
```

This will give you back a `refresh_token` from here:

```
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 14400,
  "refresh_token": "<REFRESH_TOKEN>",
  ...
}
```

Which you can then use to get an `access_token` anytime you need one, e.g.:

```
curl https://api.dropbox.com/oauth2/token \
    -d grant_type=refresh_token \
    -d refresh_token=<REFRESH_TOKEN> \
    -u <APP_KEY>:<APP_SECRET>
```

That will give me on via the CLI. But I can also query the Dropbox API directly
and get one each time I need it. Which is what I do below.

For best results, I should: cache the result of this script locally, so it only
queries the API when necessary in local development. Then, in the build script,
it will always query the API afresh.
*/

// To run this script from the CLI:
// node --env-file=.env -e 'import("./scripts/dropbox.js").then(module => module.getFiles("/notes")).then(console.log)'
let ACCESS_TOKEN = "";
const { DBX_APP_KEY, DBX_APP_SECRET, DBX_REFRESH_TOKEN } = process.env;

/**
 * Get the contents of all the files and return a mapping of file name to content
 * @param {string} path
 * @returns {Promise<{ [fileName: string]: string } | undefined>}
 */
export async function getFiles(path) {
  console.log("Getting files from Dropbox...");

  try {
    // Get and set the access token
    console.time("Get access token");
    ACCESS_TOKEN = await getAccessToken();
    console.timeEnd("Get access token");

    // Get all the files in the folder
    console.time("Get list of files");
    const files = await listFilesInFolder(path);
    console.timeEnd("Get list of files");

    // TODO: filter by .md files?

    // Get the contents of each file
    console.time("Download files");
    let filesByName = {};
    let num = 0;
    await Promise.all(
      files.map(async (file) => {
        if (file[".tag"] === "file") {
          const content = await getFileContent(file.path_display);
          filesByName[file.name] = content;
          num++;
          printProgress(`    ${num} / ${files.length} files downloaded...`);
          // console.log(`Content of ${file.name}:`, content);
        }
      })
    );
    // for (const file of files) {
    //   if (file[".tag"] === "file") {
    //     const content = await getFileContent(file.path_display);
    //     filesByName[file.name] = content;
    //     num++;
    //     printProgress(`${num} / ${files.length} files downloaded...`);
    //     // console.log(`Content of ${file.name}:`, content);
    //   }
    // }
    console.log();
    console.timeEnd("Download files");

    return filesByName;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

function printProgress(progress) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
}

/**
 * Gets an access token from Dropbox using a refresh token
 *
 * @returns {Promise<string>} The access token
 */
async function getAccessToken() {
  const basicAuth = btoa(`${DBX_APP_KEY}:${DBX_APP_SECRET}`);
  const res = await fetch("https://api.dropbox.com/oauth2/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basicAuth}` },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: DBX_REFRESH_TOKEN,
    }),
  });
  const json = await res.json();
  if (!json.access_token) {
    throw new Error("Could not get access token");
  }
  return json.access_token;
}

/**
 * Generic fetcher to interface with the Dropbox v2 API
 * @param {string} path
 * @param {Json} body
 * @returns {Promise<Json>}
 */
async function dbxFetcher(path, body = {}) {
  const url = `https://api.dropboxapi.com/2${path}`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(
            `API error: ${res.status}: ${res.statusText} - ${text}`
          );
        });
      }
      return res.json();
    })
    .then((json) => {
      if (json.error) {
        throw new Error("Dropbox API returned an error.", JSON.stringify(json));
      }

      return json;
    })
    .catch(console.log);
}

/**
 * List the files in a folder
 * @param {string} path
 * @returns {Promise<Array<{}>>}
 */
async function listFilesInFolder(path) {
  let files = [];
  let hasMore = true;
  let cursor = null;

  try {
    while (hasMore) {
      let response;
      if (cursor) {
        response = await dbxFetcher("/files/list_folder/continue", { cursor });
      } else {
        response = await dbxFetcher("/files/list_folder", { path });
      }

      files = files.concat(response.entries);
      hasMore = response.has_more;
      cursor = response.cursor;
    }
  } catch (error) {
    console.error("Error listing folder:", error);
  }

  return files;
}

/**
 * Get the contents of a text file in Dropbox
 * @param {string} path
 * @returns {string}
 */
async function getFileContent(path) {
  try {
    const headers = new Headers({
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Dropbox-API-Arg": JSON.stringify({ path }),
    });
    const res = await fetch("https://content.dropboxapi.com/2/files/download", {
      method: "POST",
      headers,
    });
    const text = await res.text();
    return text;
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
