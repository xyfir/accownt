// @ts-ignore
process.ENV = Object.assign({}, process.env);
Object.entries(process.ENV).forEach(e => {
  if (typeof e[1] == 'string') {
    if (e[1].startsWith('{') && e[1].endsWith('}')) {
      try {
        process.ENV[e[0]] = JSON.parse(e[1]);
      } catch (err) {}
    } else if (/^\d$/.test(e[1])) process.ENV[e[0]] = +e[1];
    else if (e[1] == 'true') process.ENV[e[0]] = true;
    else if (e[1] == 'false') process.ENV[e[0]] = false;
  }
});
