//Last question for lab. 

var listOfTemperatures = ["13c", "23c", "12c", "57f", "69f", "30c"];

for (var i = 0; i < listOfTemperatures.length; i++) {

    let temp = listOfTemperatures[i].toString(); // to isolate the last character
    // console.log(temp)
    if (temp.includes("c")){
        var number = parseFloat(temp)
        var fahrenheit = Math.round((number * 9 / 5) + 32);
        console.log(`${number} degrees celsius is ${fahrenheit} degrees fahrenheit.`)
    } else {
        var number = parseFloat(temp)
        var celsius = Math.round((number - 32) * 5 / 9);
        console.log(`${number} degrees fahrenheit is ${celsius} degrees celsius.`)
    }

}