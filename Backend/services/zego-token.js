import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

function generateZegoToken(userID, effectiveTime = 3600) {
    const appID = parseInt(process.env.APP_ID);
    const serverSecret = process.env.SERVER_SECRET;

    if (!appID || !serverSecret) {
        throw new Error('APP_ID and SERVER_SECRET must be provided');
    }

    const version = "04";
    const currentTime = Math.floor(Date.now() / 1000); // Current time in SECONDS

    // 1. Fixed payload structure (Zego requires specific property names)
    const payload = {
        app_id: appID,        // Must be number (not string)
        user_id: userID,      // User ID must match client
        nonce: crypto.randomBytes(16).toString('hex'),
        ctime: currentTime,    // Creation time in SECONDS
        expire: currentTime + effectiveTime, // Expiration in SECONDS
        payload: ""            // Must be empty string if unused
    };

    // 2. Correct header format
    const header = {
        typ: "JWT",
        alg: "HS256"
    };

    // 3. Proper base64 URL encoding
    const base64Header = Buffer.from(JSON.stringify(header))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const base64Payload = Buffer.from(JSON.stringify(payload))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    // 4. Correct signing string format
    const signingString = `${base64Header}.${base64Payload}`;
    
    // 5. Proper HMAC-SHA256 signature
    const signature = crypto
        .createHmac('sha256', serverSecret)
        .update(signingString)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return `${version}.${base64Header}.${base64Payload}.${signature}`;
}

export default generateZegoToken;