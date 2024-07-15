import "dotenv/config";
import process from "node:process";

// Offer access to environment variables after loading .env file.
export default () => ({
  app_key: process.env.DBX_APP_KEY,
  app_secret: process.env.DBX_APP_SECRET,
  refresh_token: process.env.DBX_REFRESH_TOKEN,
});
