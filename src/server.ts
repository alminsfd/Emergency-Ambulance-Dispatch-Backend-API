import { Server } from 'http';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
     try {
          server = app.listen(config.port, () => {
               console.log(` Ambulance Dispatch Server running on port ${config.port}`);
          });
     } catch (err) {
          console.error('Failed to start server:', err);
     }
}

main();