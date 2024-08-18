import admin from "firebase-admin"
import serviceAccount from "./serviceAccountKey.json" with { type: "json" }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "verdant-art-370316.appspot.com"
});

export default admin
export const bucket=admin.storage().bucket()