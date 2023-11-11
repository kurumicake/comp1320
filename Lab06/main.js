const { createReadStream } = require("fs");
const zlib = require("zlib");
const csv = require("csvtojson");
const { filterByCountry } = require("./filter-by-country.js");
const { sumProfit } = require("./sum-profit.js");

createReadStream("data.csv.gz")
  .pipe(zlib.Gunzip())
  .pipe(csv())
  .pipe(filterByCountry("Italy"))
  .pipe(sumProfit())
  .pipe(process.stdout) 