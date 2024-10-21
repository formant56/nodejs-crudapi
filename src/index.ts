import http from 'http';
import dotenv from 'dotenv';
import { handleRoutes } from './routes/userRoutes.js';

dotenv.config();

const port = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  handleRoutes(req, res);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
