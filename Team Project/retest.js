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
  fs = require("fs").promises,
  PNG = require("pngjs").PNG,
  path = require("path");
const { createReadStream, createWriteStream } = require("fs");
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
}
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
}

const filteredPath = (src) => {
  const fPathJoined = [];
  src.forEach(fn => fPathJoined.push(`${path.join(__dirname, "unzipped", fn)}`))
  return fPathJoined;
}

const readDir = (dir) => {
  return fs.readdir(dir)
    .then((src) => filteredDir(src))
    .then((src) => filteredPath(src))
}

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const ts = () => new PNG({ filterType: 4 })

const filterGrayScale = () => {
  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      let idx = (this.width * y + x) << 2;
      let grayscale = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
      // invert color
      this.data[idx] = grayscale;
      this.data[idx + 1] = grayscale;
      this.data[idx + 2] = grayscale;
      // and reduce opacity
      this.data[idx + 3] = this.data[idx + 3] >> 1;
    }
  }
}

const grayScale = (pathIn, pathOut) => {
  pathIn.forEach((fn, i) => {
    const outputFileName = `output_${i + 1}.png`;
    const outputFilePath = path.join(pathOut, outputFileName);

    createReadStream(fn)
      .pipe(ts())
      .on("parsed", function () {
        filterGrayScale.call(this)
        this.pack()
          .pipe(createWriteStream(outputFilePath));
      });
  })
}


module.exports = {
  unzip,
  readDir,
  grayScale,
};
