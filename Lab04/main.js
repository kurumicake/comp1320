const distance = require("./mathHelpers").distance;
const process = require("process");
const fs = require("fs");
const path = require("path");
const os = require('os');

const x1 = process.argv[2];
const y1 = process.argv[3];
const x2 = process.argv[4];
const y2 = process.argv[5];

processInput = (userInput) => {
    fs.mkdir("dataPoints", { recursive: true }, (err) => {
        if (err) {
            if (err.code === 'EEXIST') {
                return console.log("Sorry, this folder name already exists.. please choose another name.")
            }
            return console.log(err);
        } else {
            console.log(`Folder "dataPoints" created.`);
            const filePath = path.join(__dirname, "dataPoints", "point.txt");
            fs.writeFile(filePath, userInput, (err) => {
                if (err) {
                    return console.log(err);
                } else {
                    console.log(`Content saved`);
                    const output = (`${os.EOL}The distance between your two points: (${x1}, ${y1}), (${x2}, ${y2}) is ${distance(x1, x2, y1, y2)}. `);
                    fs.appendFile(filePath, output, (err) => {
                        if (err) {
                           return console.log(err);
                        } else {
                            console.log(`Content updated`);
                        }
                    });
                }
            });
        }
    });
};


processInput(`${x1}, ${y1}, ${x2}, ${y2}`);