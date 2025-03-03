const admin = require("firebase-admin");
const serviceAccount = require("./workshop-a105b-firebase-adminsdk-fbsvc-3e93d8cfc7.json"); // Ensure correct path

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

// Function to set 'society' custom claim
const setSocietyClaim = async (uid) => {
  try {
    await auth.setCustomUserClaims(uid, { society: true });
    console.log(`✅ Custom claim 'society' set for user: ${uid}`);
  } catch (error) {
    console.error("❌ Error setting custom claim:", error);
  }
};

// Replace with actual user UID
const userId = "vc1VTSt9zFgPxIZQnB6s9Mg63ye2"; 
setSocietyClaim(userId);
