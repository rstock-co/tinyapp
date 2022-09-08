const { assert } = require('chai');

const { getUserByEmail } = require('../js/helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
    assert.deepEqual(user,{
        id: "userRandomID", 
        email: "user@example.com", 
        password: "purple-monkey-dinosaur"
      });
  });
  it("should return a `null` object when sending a non-existent email", () => {
    const user = getUserByEmail("", testUsers);
    const expectedUserID = undefined;
    assert.strictEqual(user, null);
  });
});