const square = num => Math.pow(num, 2);

const squareRoot = (sqrX, sqrY) => Math.sqrt(sqrX + sqrY);

const distance = (x1, x2, y1, y2) => squareRoot(square(x2 - x1), square(y2 - y1));

module.exports = { distance }
