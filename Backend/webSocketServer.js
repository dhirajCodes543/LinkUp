import { WebSocketServer } from 'ws';
import generateToken from './services/roomGeneration.js';

const waitingClients = [];

const startWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log("WebSocket client connected");

    ws.on('message', async (msg) => {
      let data;

      // Safe JSON parsing
      try {
        data = JSON.parse(msg);
      } catch {
        return ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      }

      // Handle cancel requests
      if (data.type === 'cancel') {
        const index = waitingClients.findIndex(c => c.ws === ws);
        if (index !== -1) {
          clearTimeout(waitingClients[index].timeout);
          waitingClients.splice(index, 1);
          ws.send(JSON.stringify({ type: 'matching_stopped' }));
          console.log(`Client cancelled matching. Queue size: ${waitingClients.length}`);
        }
        return;
      }

      // Handle join requests
      if (data.type === 'join' && Array.isArray(data.interests)) {
        // Basic validation
        if (data.interests.length === 0 || data.interests.length > 20) {
          return ws.send(JSON.stringify({ type: 'error', message: 'Interests must be 1-20 items' }));
        }

        // Check if already in queue
        if (waitingClients.some(c => c.ws === ws)) {
          return ws.send(JSON.stringify({ type: 'error', message: 'Already in queue' }));
        }

        const newInterests = data.interests.map(i => String(i).trim().toLowerCase());
        const clientId = data.id ;

        // Try to find a match
        const matchIndex = waitingClients.findIndex(client =>
          client.interests.some(i => newInterests.includes(i))
        );

        if (matchIndex !== -1) {
          // Match found!
          const matchedClient = waitingClients.splice(matchIndex, 1)[0];
          clearTimeout(matchedClient.timeout);

          try {
            const roomName = `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

            const tokenA = await generateToken(clientId);
            const tokenB = await generateToken(matchedClient.id);

            // 2. Prepare payloads
            const payloadA = JSON.stringify({
              type: 'match_found',
              room: roomName,
              token: tokenA,
            });
            
            const payloadB = JSON.stringify({
              type: 'match_found',
              room: roomName,
              token: tokenB,
            });

            if (matchedClient.ws.readyState === 1) { // WebSocket.OPEN = 1
              matchedClient.ws.send(payloadB);
            }
            if (ws.readyState === 1) {
              ws.send(payloadA);
            }
            console.log(`Paired clients in room: ${roomName}`);
          } catch (error) {
            console.error('Failed to create room or send tokens:', error);
            // Optionally notify clients about failure
            if (matchedClient.ws.readyState === 1) {
              matchedClient.ws.send(JSON.stringify({ type: 'error', message: 'Room creation failed' }));
            }
            if (ws.readyState === 1) {
              ws.send(JSON.stringify({ type: 'error', message: 'Room creation failed' }));
            }
          }
        } else {
          // No match, add to queue with 15 sec timeout
          const timeout = setTimeout(() => {
            const index = waitingClients.findIndex(c => c.ws === ws);
            if (index !== -1) {
              waitingClients.splice(index, 1);
              if (ws.readyState === 1) {
                ws.send(JSON.stringify({ type: 'timeout', message: 'No match found. Try again.' }));
              }
              console.log('Client removed from queue after 15 seconds');
            }
          }, 15000);

          waitingClients.push({ ws, interests: newInterests, timeout, id: clientId });
          ws.send(JSON.stringify({ type: 'queued', message: 'Looking for match...' }));
          console.log(`Added client to queue. Queue size: ${waitingClients.length}`);
        }
      }
    });

    // Clean up on disconnect
    ws.on('close', () => {
      const index = waitingClients.findIndex(c => c.ws === ws);
      if (index !== -1) {
        clearTimeout(waitingClients[index].timeout);
        waitingClients.splice(index, 1);
        console.log(`Client disconnected. Queue size: ${waitingClients.length}`);
      }
    });

    // Clean up on error
    ws.on('error', (error) => {
      console.error('WebSocket error:', error.message);
      const index = waitingClients.findIndex(c => c.ws === ws);
      if (index !== -1) {
        clearTimeout(waitingClients[index].timeout);
        waitingClients.splice(index, 1);
      }
    });
  });

  return wss;
};

export default startWebSocketServer;