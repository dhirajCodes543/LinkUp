import dotenv from 'dotenv';
dotenv.config();

import Ably from 'ably'
const rest = new Ably.Rest(process.env.ABLY_KEY); // from .env

async function generateToken(clientId) {
  const tokenDetails = await rest.auth.requestToken({
    clientId,
    ttl: 20 * 60 * 500, // valid for 1 hour
  });
  return tokenDetails.token;
}

export default generateToken
