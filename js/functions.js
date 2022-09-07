// note that max value for base is 36: higher base = more alpha chars vs numeric chars
const generateID = (base, stringLength) =>
  Math.random()
    .toString(base) 
    .substring(2, stringLength + 2);

module.exports = { generateID };