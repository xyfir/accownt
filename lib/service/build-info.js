/**
 * Takes info object and places each field within required or optional
 * object keyerties.
 * { fname: { optional: false, required: true, value: "" }, ...}
 * is converted to
 * { required: { fname: "Used for...", ...}, optional: { ... }}
 * @param {string} info - A JSON string of the object to be converted.
 * @returns {string} A JSON string of the modified object.
 */
module.exports = function(info) {
  const _info = { required: {}, optional: {} };
  info = JSON.parse(info);

  Object.keys(info).forEach(key => {
    if (info[key].required) _info.required[key] = info[key].value;
    else if (info[key].optional) _info.optional[key] = info[key].value;
  });

  return JSON.stringify(_info);
};
