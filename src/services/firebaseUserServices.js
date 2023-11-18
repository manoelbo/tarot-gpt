const admin = require("../index");

async function createUserInFirebase(phoneNumber) {
  try {
    let userRecord = await admin
      .auth()
      .getUserByPhoneNumber(phoneNumber)
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          return null;
        }
        throw error;
      });

    if (!userRecord) {
      userRecord = await admin.auth().createUser({
        phoneNumber: phoneNumber,
      });

      console.log("Successfully created new user:", userRecord.uid);
    } else {
      console.log("User already exists:", userRecord.uid);
    }
    return userRecord;
  } catch (error) {
    console.error("Error in user creation/check:", error);
    throw error;
  }
}

module.exports = {
  createUserInFirebase,
};
