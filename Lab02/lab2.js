function switchForDayOfWeek(result) {
  let w;
  switch (result) { // utilize the switch statement to match on our result value to determine the day of the week
    case 0: // if the result value is equal to 0, then it is a saturday
      w = "Saturday";
      break;
    case 1:
      w = "Sunday";
      break;
    case 2:
      w = "Monday";
      break;
    case 3:
      w = "Tuesday";
      break;
    case 4:
      w = "Wednesday";
      break;
    case 5:
      w = "Thursday";
      break;
    case 6:
      w = "Friday";
  }
  return w;
} 

function determineOffSets(year) {
  // need a function to determine offsets of special years
  let returnValue = 0; // defining an initial value that can be changed later on
  if (year < 10000 || year > 999) { // if the year is 4 digits
    const yearAsStr = year.toString(); // convert a number to a string
    const first2Digits = yearAsStr.substring(0, 2); // take the first 2 digits of the string
    const first2DigitsAsNum = parseInt(first2Digits); // turn the string back into a number

    if (first2DigitsAsNum == 16) {
      // if the first two digits of the year matches the conditions, then update the return value to the proper offset number
      returnValue = 6;
    } else if (first2DigitsAsNum == 17) {
      returnValue = 4;
    } else if (first2DigitsAsNum == 18) {
      returnValue = 2;
    } else if (first2DigitsAsNum == 20) {
      returnValue = 6;
    } else if (first2DigitsAsNum == 21) {
      returnValue = 4;
    }
    return returnValue; // now return the updated offset value
  }
}

function determineMonthCode(month) {

  let monthCode; // create a variable called monthcode, doesn't always have to have initial value but it is best to specify first.
  
  switch (true) { //utilizing switch statement to match on a condition that will return true
    case month === "April" || month === "July":
      monthCode = 0;  
      break;
    case month === "January" || month === "October": // if the switch matches true on January or October, then update the month code to 1 and return it
      monthCode = 1;
      break;
    case month === "May":
      monthCode = 2;
      break;
    case month === "August":
      monthCode = 3;
      break;
    case month === "February" || month === "March" || month === "November":
      monthCode = 4;
      break;
    case month === "June":
      monthCode = 5;
      break;
    case month === "September" || month === "December":
      monthCode = 6;
      break;
  }
  return monthCode;
}

function isLeapYear(year) {
  // need a function to determine if a year is a leap year
  let leapYear = 0; // set an initial value for leapYear
  if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {  //(if the year is divisible by 4 AND not divisible by 100) OR (if it is divisible by 400)
    leapYear = 1; // update the leapYear value to 1 if it is a leapYear. NOTE: 0 usually means false, 1 means true
  } 
  return leapYear; // return the updated value of leapYear
}

function getDayOfTheWeek(year, month, day) {  // the main function to determine the day of the week in main.js
  let result;
  let result2;
    const last2DigitsOfYear = year % 100; // Step 1a - gives me last 2 digits
    const numOf12Fits = Math.floor(last2DigitsOfYear / 12); // Step 1b - gives me how many 12s fits in
    const remainderOfThisDivision = Math.floor(last2DigitsOfYear - numOf12Fits * 12); // Step 2 - gives me the remainder
    const numOf4Fits = Math.floor(remainderOfThisDivision / 4); // Step 3 - gives how many 4s in remainder
    const dayOfTheMonth = day; // Step 4 - Determine the day of the month
    const addMonthCode = determineMonthCode(month); // Step 5 - utilized the function determineMonthCode to determine the Month Code
    const offset = determineOffSets(year); // used the function determineOffsets to determine offsets for special years
    const total = Math.floor(numOf12Fits + remainderOfThisDivision + numOf4Fits + dayOfTheMonth + addMonthCode + offset); // Step 6a - combine all
    result = Math.floor(total % 7); // Step 6b - mod 7 the total result
    
  if (isLeapYear(year) == 1) {  // utilize the isLeapYear function to determine if the year is a LeapYear. Recall 1 is equal to true, meaning it is a leap year
    if (month === "January" || month === "February") { 
      let specialLeapYear = (result-1)
      result2 = switchForDayOfWeek(specialLeapYear);
      return result2;
    } else {
      result2 = switchForDayOfWeek(result);
      return result2;
    }
  } else {
    result2 = switchForDayOfWeek(result);
    return result2;
    }
  }


//makeCalendar
const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const monthNum = [1,2,3,4,5,6,7,8,9,10,11,12]

function lastDayOfEachMonth(k) {
  let lastDay;
  switch(true) {
    case k === "February":
      lastDay = 28;
      break;
    case k === "April" || k === "June" || k === "September" || k === "November":
      lastDay = 30;
      break;
    case k === "January" || k === "March" || k === "May" || k === "July" || k === "August" || k === "October" || k === "December":
      lastDay = 31;
      break;
  }
  return lastDay;
}

function makeCalendar() {
  for (let i = 0; i < monthList.length; i++) {
    let tempMonth = monthList[i];
    for (let j = 1; j <= lastDayOfEachMonth(tempMonth); j++) {
      let tempDayOfTheWeek = getDayOfTheWeek("2023",tempMonth, j);
      console.log(monthNum[i] + "-" + j + "-2023 is a " + tempDayOfTheWeek + ".");
    }
    
  }
}
//calling the function in main.js
module.exports = {getDayOfTheWeek, makeCalendar,isLeapYear,determineMonthCode,determineOffSets, switchForDayOfWeek, lastDayOfEachMonth};
