import { IncomingMessage, ServerResponse } from 'http';
import {
  getAllUsers,
  getUserById,
  createNewUser,
  updateExistingUser,
  deleteUserById,
} from '../controllers/userController';

export const handleRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const method = req.method;
  const url = req.url;

  if (url === '/api/users' && method === 'GET') {
    getAllUsers(req, res);
  } else if (url?.startsWith('/api/users/') && method === 'GET') {
    getUserById(req, res);
  } else if (url === '/api/users' && method === 'POST') {
    createNewUser(req, res);
  } else if (url?.startsWith('/api/users/') && method === 'PUT') {
    updateExistingUser(req, res);
  } else if (url?.startsWith('/api/users/') && method === 'DELETE') {
    deleteUserById(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};
