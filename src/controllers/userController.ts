import { IncomingMessage, ServerResponse } from 'http';
import { findAllUsers, findUserById, createUser, updateUser, deleteUser } from '../utils/database';

export const getAllUsers = (req: IncomingMessage, res: ServerResponse) => {
  const users = findAllUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const getUserById = (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/')[3];
  const user = id && findUserById(id);

  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};

export const createNewUser = (req: IncomingMessage, res: ServerResponse) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const { username, age, hobbies } = JSON.parse(body);

    if (!username || !age || !Array.isArray(hobbies)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid request body' }));
      return;
    }

    const newUser = createUser(username, age, hobbies);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  });
};

export const updateExistingUser = (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/')[3];
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const { username, age, hobbies } = JSON.parse(body);

    const updatedUser = id && updateUser(id, username, age, hobbies);

    if (!updatedUser) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
  });
};

export const deleteUserById = (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/')[3];

  if (id && deleteUser(id)) {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
};
