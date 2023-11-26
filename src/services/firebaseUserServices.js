const admin = require('firebase-admin');

async function getUserInFirebase(phoneNumber) {
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

async function checkDailyCradit(userUid) {
  let dailyCradit = {
    on_hold: false,
    hours: 0,
    minutes: 0,
  };

  try {
    const timestamp = await getLastReadingByUser(userUid);
    if (timestamp) {
      // Convertendo o objeto Timestamp para milissegundos
      const lastReadingMillis = (timestamp._seconds * 1000) + (timestamp._nanoseconds / 1000000);
      const today = new Date().getTime();
      const diff = today - lastReadingMillis;
      const day = 86400000; // 24 horas em milissegundos

      if (day - diff > 0) {
        dailyCradit.on_hold = true;
        dailyCradit.hours = Math.floor((day - diff) / 1000 / 60 / 60) % 24;
        dailyCradit.minutes = Math.floor((day - diff) / 1000 / 60) % 60;
        return dailyCradit;
      } else {
        dailyCradit.on_hold = false;
        return dailyCradit;
      }
    }
  } catch (error) {
    console.error('Not able to get last reading', error);
    throw error;
  }

  return dailyCradit;
}

async function getLastReadingByUser(userUid) {
  const db = admin.firestore();
  try {
    const readings = await db.collection('readings')
                             .where('user', '==', db.doc('users/' + userUid))
                             .where('status', '==', 'complete')
                             .orderBy('end_timestamp', 'desc')
                             .limit(1)
                             .get();

    if (!readings.empty) {
      const lastReading = readings.docs[0];
      const endTimestamp = lastReading.data().end_timestamp;
      console.log('Last complete reading timestamp for user', userUid, ':', endTimestamp);
      return endTimestamp;
    } else {
      console.log('No complete readings found for user:', userUid);
      return null;
    }
  } catch (error) {
    console.error('Error getting last reading by user:', error);
    throw error;
  }
}

// Função para criar um novo registro na coleção "readings"
async function addNewReading(userUid) {
  const db = admin.firestore();
  try {
    const newReadingRef = db.collection('readings').doc();
    await newReadingRef.set({
      start_timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'in_progress',
      end_timestamp: null,
      user: db.doc('users/' + userUid),
      feedback: 0,
      error: null
    });
    console.log('New reading added with ID:', newReadingRef.id);
    return newReadingRef.id;
  } catch (error) {
    console.error('Error adding new reading:', error);
    throw error;
  }
}

// Função para atualizar o status de uma leitura
async function updateReadingStatus(readingId, status, error = null) {
  const db = admin.firestore();
  try {
    const readingRef = db.collection('readings').doc(readingId);
    const updates = { status: status };

    if (status === 'complete') {
      updates.end_timestamp = admin.firestore.FieldValue.serverTimestamp();
    } else if (status === 'fail' && error) {
      updates.error = error;
    }

    await readingRef.update(updates);
    console.log('Reading status updated for ID:', readingId);
  } catch (error) {
    console.error('Error updating reading status:', error);
    throw error;
  }
}

// Função para atualizar o feedback da última leitura de um usuário
async function updateReadingFeedback(readingId, feedback) {
  const db = admin.firestore();
  let updates;
  try {
    const readingRef = db.collection('readings').doc(readingId);
    if (feedback === 'yes') {
      updates = { feedback: 1 };
    } else if (feedback === 'no') { 
      updates = { feedback: -1 };
    } else {
      updates = { feedback: 0 };
    }
    await readingRef.update(updates);
    console.log('Reading feedback updated for ID:', readingId);

  } catch (error) {
    console.error('Error updating reading feedback:', error);
    throw error;
  }
}




module.exports = {
  getUserInFirebase,
  formatToE164,
  checkDailyCradit,
  addNewReading,
  updateReadingStatus,
  updateReadingFeedback
};
