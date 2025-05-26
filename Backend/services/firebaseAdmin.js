import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" }; // ✅ JSON import

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
