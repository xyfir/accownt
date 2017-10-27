/**
 * Parses the query string within `location.hash` into an object.
 * @return {object}
 */
export default function() {

  const query = {};
  let qs = location.hash.split('?')[1];

  if (qs == undefined) return query;

  qs.split('&').forEach(q => {
    const [key, value] = q.split('=');

    query[key] = value === undefined
      ? '' : decodeURIComponent(value);
  });

  return query;

}