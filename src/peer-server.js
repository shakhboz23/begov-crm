import { PeerServer } from 'peer';
const server = PeerServer({
  port: 9001,
  path: '/peerjs',
});

server.on('connection', (client) => {
  console.log('New PeerJS client connected: ' + client.id);
});

server.on('disconnect', (client) => {
  console.log('PeerJS client disconnected: ' + client.id);
});
