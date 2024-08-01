export default async function Index(data) {
  // Path to the module with a timestamp to force reload
  const modulePath = `./index.js?t=${Date.now()}`;

  // Dynamically import the module
  const module = await import(modulePath);
  const result = module.default(data);

  return result;
}
