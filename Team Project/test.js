const unzipper = require("adm-zip");
const fs = require("fs").promises;
const path = require("path")
const PNG = require("pngjs").PNG
const { createReadStream, createWriteStream, read } = require("fs");
const pathProcessed = path.join(__dirname, "grayscaled");

const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");

const unzip = (pathIn, pathOut) => {
    return new Promise((resolve) => {
        const zip = new unzipper(pathIn)
        resolve(zip.extractAllTo(pathOut));
    })
}

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


const grayScale = (pathIn, pathOut) => {
    pathIn.forEach((fn, i) => {
        const outputFileName = `output_${i + 1}.png`;
        const outputFilePath = path.join(pathOut, outputFileName);

        createReadStream(fn)
            .pipe(
                new PNG({ 
                    filterType: 4,
                 })
                 )
            .on("parsed", () => {
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
                this.pack().pipe(createWriteStream(outputFilePath));;
            });
    })
}




unzip(zipFilePath, pathUnzipped)
    .then(() => readDir(pathUnzipped))
    .then((src) => grayScale(src, pathProcessed))
    .catch((err) => console.log(err))