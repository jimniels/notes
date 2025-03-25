export default function postsByDomain(posts) {
  const out = posts.reduce((acc, item) => {
    if (acc[item._external_url_domain]) {
      acc[item._external_url_domain].push(item);
      // acc[item._external_url_domain]++;
    } else {
      acc[item._external_url_domain] = [item];
      // acc[item._external_url_domain] = 1;
    }
    return acc;
  }, {});
  return out;
}
