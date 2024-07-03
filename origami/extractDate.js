export default function extractDate(id) {
  const [date, time] = id.split("T");
  const dateISO =
    date + "T" + time.slice(0, 2) + ":" + time.slice(2, 4) + "-0600"; // MDT -0600 from zulu
  return new Date(dateISO).toISOString();
}
