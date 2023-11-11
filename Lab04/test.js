// const distance = require("./mathHelpers").distance;
// const process = require("process");
// const fs = require("fs");
// const path = require("path");
// const os = require('os');

// const x1 = process.argv[2];
// const y1 = process.argv[3];
// const x2 = process.argv[4];
// const y2 = process.argv[5];

// function processInput() {
//     let userInput = (`${x1}, ${y1}, ${x2}, ${y2}`);

//     fs.mkdir("dataPoints", { recursive: true }, (err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(`Folder "dataPoints" created.`);
//             const filePath = path.join("dataPoints", "point.txt");
//             fs.writeFile(filePath, userInput, (err) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log(`Content saved`);
//                     const output = (`${os.EOL}The distance between your two points: (${x1}, ${y1}), (${x2}, ${y2}) is ${distance(x1, x2, y1, y2)}. `);
//                     fs.appendFile(filePath, output, (err) => {
//                         if (err) {
//                             console.log(err);
//                         } else {
//                             console.log(`Content updated`);
//                         }
//                     });
//                 }
//             });
//         }
//     });
// };


// processInput();

console.log(__dirname);
