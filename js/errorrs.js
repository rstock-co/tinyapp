const errNotLoggedIn = (res, cookie) => {
    if (!cookie) {
      res.send("You must register or be logged in to do this.");
      return true;
    }
    return false;
  }
  
  const errDoesNotExist = (res, id, database) => {
    // if URL doesn't exist
    if (!database[id]) {
      res.send("This URL does not exist. Click on 'Create New URL' to add new URLs.");
      return true;
    }
    return false;
  }
  const errDoesNotBelongToUser = (res, id, cookie, database) => {
    // if URL doesn't belong to user
    if (database[id].userID !== cookie) {
      res.send("This URL is not in your database. Click on 'Create New URL' to add new URLs.");
      return true;
    }
    return false;
  }

  module.exports = {errNotLoggedIn, errDoesNotExist, errDoesNotBelongToUser }