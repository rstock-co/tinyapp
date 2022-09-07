// note that max value for base is 36: higher base = more alpha chars vs numeric chars
const generateID = (base, stringLength) =>
  Math.random()
    .toString(base)
    .substring(2, stringLength + 2);

// return either the entire user object or null if not found.
const userLookup = (email, userID, userDatabase) => {
  if (email === userDatabase[userID].email) {
    return userDatabase;
  }
  return null;
};

module.exports = { generateID, userLookup };
