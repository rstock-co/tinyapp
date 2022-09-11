const generateID = (base, stringLength) =>
  Math.random()
    .toString(base)
    .substring(2, stringLength + 2);

const getUserByEmail = (email, userDatabase) => {
  for (user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
  return null;
};

const urlsForUser = (id, urlDatabase) => {
  if (!id) return null;
  let urls = {};
  for (url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urls[url] = urlDatabase[url]
    }
  }
  return urls;
}

const appendHttp = (url) => {
  if (url.substring(0, 4) !== "http") {
    return url = `https://${url}`;
  }
  return url;
}

const convertTodayToString = () => {
    var today = new Date();
  
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1);
    var yyyy = today.getFullYear();
  
    return mm + "/" + dd + "/" + yyyy;
  };
  
module.exports = { generateID, getUserByEmail, urlsForUser, appendHttp, convertTodayToString };
