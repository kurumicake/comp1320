let num = 66666444345;

const change = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const final = change(num);
console.log(`$${final}`);


totalProfit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

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
