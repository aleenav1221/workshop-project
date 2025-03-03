const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Make sure the file path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

module.exports = { auth };
