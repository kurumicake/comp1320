const getDayOfTheWeek = require("./lab2").getDayOfTheWeek;
const makeCalendar = require("./lab2").makeCalendar;
const readline = require("readline-sync");
// const isLeapYear = require("./lab2").isLeapYear;
// const determineMonthCode = require("./lab2").determineMonthCode;
// const determineOffSets = require("./lab2").determineOffSets;
// const switchForDayOfWeek = require("./lab2").switchForDayOfWeek;
// const lastDayOfEachMonth = require("./lab2").lastDayOfEachMonth;

function getDayOfTheWeekForUserDate() {
    const year = readline.question("Enter year: ")
    const month = readline.question("Enter month: ")
    const day = readline.question("Enter day: ")

    console.log(getDayOfTheWeek(year, month, day));
}

getDayOfTheWeekForUserDate();
makeCalendar();
