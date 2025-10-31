import e from 'express';
import { getClient } from '../../db.js';

export async function getAllUsers() {
  const client = await getClient();
  const { rows } = await client.query(
    'SELECT id, username, firstname, lastname, email, is_admin FROM users'
  );
  await client.end();
  return rows;
}

export async function getUserById(id) {
  const client = await getClient();
  const { rows } = await client.query('SELECT * FROM users WHERE id = $1', [
    id,
  ]);
  await client.end();
  return rows[0];
}
export async function createUser({
  username,
  firstname,
  lastname,
  email,
  pass_hash,
}) {
  const client = await getClient();
  const q = `
    INSERT INTO users (username, firstname, lastname, email, pass_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, firstname, lastname, email, is_admin, created_at
  `;
  const { rows } = await client.query(q, [
    username,
    firstname,
    lastname,
    email,
    pass_hash,
  ]);
  await client.end();
  return rows[0];
}

export async function updateUser(
  id,
  { firstname, lastname, email, pass_hash }
) {
  const client = await getClient();

  const q = `
    UPDATE users
    SET firstname = $1,
        lastname = $2,
        email = $3,
        pass_hash = $4
    WHERE id = $5
    RETURNING id, username, firstname, lastname, email, is_admin, created_at
  `;

  const values = [firstname, lastname, email, pass_hash, id];
  const { rows } = await client.query(q, values);

  await client.end();
  return rows[0];
}

export async function deleteUser(id) {
  const client = await getClient();
  await client.query('DELETE FROM users WHERE id = $1', [id]);
  await client.end();
  return { success: true };
}
