const admin = require('firebase-admin');

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

function formatToE164(phoneNumber) {
  if (!phoneNumber.startsWith('+')) {
      return '+' + phoneNumber;
  }
  return phoneNumber;
}

async function createUserOrUpdateUserRecord(uid, lastReading, evaluationScore, evaluationTimestamp) {
  const db = admin.firestore();
  try {
      const userRef = db.collection('users').doc(uid);
      await userRef.set({
        last_reading: lastReading,
        evaluation: {
            score: evaluationScore,
            timestamp: evaluationTimestamp
        },
      }, { merge: true });
      
      console.log(`User record updated for UID: ${uid}`);
  } catch (error) {
      console.error('Error updating user record:', error);
      throw error;
  }
}

module.exports = {
  createUserInFirebase,
  createUserOrUpdateUserRecord,
  formatToE164,
};
