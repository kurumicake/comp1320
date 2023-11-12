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

async function main() {
    try {
        await IOhandler.unzip(zipFilePath, pathUnzipped);
        const src = await IOhandler.readDir(pathUnzipped);
        await Promise.all(
            src.map((fn, i) => IOhandler.grayScale(fn, pathProcessed, i))
        );
    } catch (error) {
        console.error(error);
    }
}

main();