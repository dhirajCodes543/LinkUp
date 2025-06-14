import admin from '../services/firebaseAdmin.js'


const authenticateFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1]
    if (!token){
        return res.status(401).json({ error: "Token missing" })
    }
    try {

        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken.email_verified) {
            console.log("Email error")
            return res.status(403).json({ error: "Email not verified" });
        }

        req.user = decodedToken;
        next()

    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ error: "Invalid or Expired token" });
    }
}

export default authenticateFirebaseToken