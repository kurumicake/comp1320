const { Transform } = require("stream");

const filterByCountry = (country) => {
    return new Transform({
        objectMode: true,
        transform(chunk, enc, cb) {
            const jsonChunk = JSON.parse(chunk);
            if (jsonChunk.country === country) {
                cb(null, JSON.stringify(jsonChunk))
            } else {
                cb();
            }
        }
    })
}

module.exports = { filterByCountry };