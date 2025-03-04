import app from './app';
import mongoose from 'mongoose';
import config from './config';
import { Server } from 'socket.io';
import http from 'http';

export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      'https://frontend-note-and-nest.vercel.app',
      'http://localhost:5175',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  },
});

// // Store user socket mappings
// let userSocketMap: Record<string, string> = {};

// // Function to get receiver's socket ID
// export function getRecieverSocketId(userId: string) {
//   console.log('Received userId => ->:', userId);

//   return userSocketMap[userId];
// }

async function main() {
  try {
    await mongoose.connect(config.Mongodb_url as string);
    server.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
    io.on('connection', (socket) => {
      console.log('a user connected', socket.id);

      setInterval(() => {
        socket.emit('notification', {
          message: 'You have a new notification!',
        });
      }, 5000);

      socket.on('disconnect', () => {
        console.log('a user disconnected', socket.id);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

main();
