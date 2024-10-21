import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

const users: User[] = [];

export const findAllUsers = () => users;

export const findUserById = (id: string) => users.find(user => user.id === id);

export const createUser = (username: string, age: number, hobbies: string[]) => {
  const newUser: User = { id: uuidv4(), username, age, hobbies };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id: string, username: string, age: number, hobbies: string[]) => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex > -1) {
    users[userIndex] = { id, username, age, hobbies };
    return users[userIndex];
  }
  return null;
};

export const deleteUser = (id: string) => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex > -1) {
    users.splice(userIndex, 1);
    return true;
  }
  return false;
};
