const { Transform } = require("stream");

const sumProfit = () => {
    let totalProfit = 0;
    return new Transform({
        objectMode: true,
        transform(chunk, enc, cb) {
            const jsonParse = JSON.parse(chunk)
            const profit = parseFloat(jsonParse.profit);
            if (!isNaN(profit)) {
                totalProfit += profit;
            }
            cb();
        },
        flush(cb) {
            let final = totalProfit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            this.push(`Total profit is $${final}`)
            cb();
        }
    })
}

module.exports = { sumProfit };