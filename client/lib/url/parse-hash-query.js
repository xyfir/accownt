export default function() {

    let query = {};
    let qs = location.hash.split('?')[1];

    if (qs !== undefined) {
        qs = qs.split('&');

        qs.forEach(q => {
            const t = q.split('=');

            query[t[0]] = t[1] === undefined
                ? "" : decodeURIComponent(t[1]);
        });
    }

    return query;

}