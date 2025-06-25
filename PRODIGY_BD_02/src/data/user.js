import fs from 'fs/promises';
const filePath = './src/data/users.json';

const users = new Map();

export const loadUsersFromFile = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(data);
    json.forEach(user => users.set(user.id, user));
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filePath, '[]');
    } else {
      throw err;
    }
  }
};

export const saveUsersToFile = async () => {
  const userArray = Array.from(users.values());
  await fs.writeFile(filePath, JSON.stringify(userArray, null, 2));
};

export default users;
