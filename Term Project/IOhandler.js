/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: November 08, 2023
 * Author: Christy Wan
 *
 */

const unzipper = require("adm-zip"),
  fs = require("fs/promises"),
  PNG = require("pngjs").PNG,
  path = require("path");
const { createReadStream, createWriteStream } = require("fs");
const { pipeline } = require("stream");
/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve) => {
    const zip = new unzipper(pathIn)
    resolve(zip.extractAllTo(pathOut));
  })
    .then(() => console.log("Extraction operation complete!"))
};
// might want to use adm-zip

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */

const filteredDir = (src) => {
  const extension = ".png";
  const filtered = src.filter((file) => file.indexOf(extension) !== -1);
  return filtered;
};

const filteredPath = (src) => {
  const fPathJoined = [];
  src.forEach(fn => fPathJoined.push(`${path.join(__dirname, "unzipped", fn)}`))
  return fPathJoined;
};

const readDir = (dir) => {
  return fs.readdir(dir)
    .then((src) => filteredDir(src))
    .then((src) => filteredPath(src))
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const ts = () => new PNG({ filterType: 4 })
  .on("parsed", function () {
    filterGrayScale(this.data, this.height, this.width);
    this.pack();
    console.log(`File processed`);
  });

const filterGrayScale = (data, height, width) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (width * y + x) << 2;
      let grayscale = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      data[idx] = grayscale;
      data[idx + 1] = grayscale;
      data[idx + 2] = grayscale;
    }
  }
  return data;
};

const errorHandle = (err) => {
  if (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
  console.log("Done!");
};

const grayScale = (fn, pathOut, i) => {
  const outputFileName = `output_${i + 1}.png`;
  const outputFilePath = path.join(pathOut, outputFileName);

  pipeline(
    createReadStream(fn),
    ts(),
    createWriteStream(outputFilePath),
    errorHandle
  );
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
