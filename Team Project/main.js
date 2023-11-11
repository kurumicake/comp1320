const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date: November 08, 2023
 * Author: Christy Wan
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
    .then(() => IOhandler.readDir(pathUnzipped))
    .then((src) => {
        const promises = [];
        src.forEach((fn, i) => promises.push(IOhandler.grayScale(fn, pathProcessed, i)))
        returnPromise.all(promises)
    })
    .catch((err) => console.log(err))