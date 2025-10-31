import * as userService from '../services/userService.js';
import bcrypt from 'bcrypt';

export async function getUsers(req, res) {
  const users = await userService.getAllUsers();
  res.json({ users });
}

export async function getUser(req, res) {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

export async function addUser(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password)
    return res.status(400).json({ error: 'missing_fields' });

  const pass_hash = await bcrypt.hash(password, 10);
  const user = await userService.createUser({
    username,
    firstname,
    lastname,
    email,
    pass_hash,
  });
  res.status(201).json(user);
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { firstname, lastname, email, password } = req.body;
  const pass_hash = password ? await bcrypt.hash(password, 10) : null;
  try {
    const updated = await userService.updateUser(id, {
      firstname,
      lastname,
      email,
      pass_hash,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ error: `Sorry couldn't update, please try again.` });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'failed to update' });
  }
}

export async function removeUser(req, res) {
  await userService.deleteUser(req.params.id);
  res.json({ deleted: true });
}
