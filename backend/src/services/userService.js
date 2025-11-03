import e from "express";
import { getClient } from "../../db.js";

export async function getAllUsers() {
  const client = await getClient();
  const { rows } = await client.query(
    "SELECT id, username, firstname, lastname, email, is_admin FROM users"
  );
  await client.end();
  return rows;
}

export async function getUserById(id) {
  const client = await getClient();
  const { rows } = await client.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  await client.end();
  return rows[0];
}

export async function getUserByUsernameOrEmail(identifier) {
  const client = await getClient();
  try {
    const { rows } = await client.query(
      `SELECT id, username, firstname, lastname, email, is_admin, password_hash
       FROM users
       WHERE username = $1 OR email = $1`,
      [identifier]
    );
    return rows[0];
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  } finally {
    await client.end();
  }
}
export async function createUser({
  username,
  firstname,
  lastname,
  email,
  password_hash,
}) {
  const client = await getClient();
  const q = `
    INSERT INTO users (username, firstname, lastname, email, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, firstname, lastname, email, is_admin, created_at
  `;
  const { rows } = await client.query(q, [
    username,
    firstname,
    lastname,
    email,
    password_hash,
  ]);
  await client.end();
  return rows[0];
}

export async function updateUser(
  id,
  { firstname, lastname, email, password_hash }
) {
  const client = await getClient();

  const q = `
    UPDATE users
    SET firstname = $1,
        lastname = $2,
        email = $3,
        password_hash = $4
    WHERE id = $5
    RETURNING id, username, firstname, lastname, email, is_admin, created_at
  `;

  const values = [firstname, lastname, email, password_hash, id];
  const { rows } = await client.query(q, values);

  await client.end();
  return rows[0];
}

export async function deleteUser(id) {
  const client = await getClient();
  await client.query("DELETE FROM users WHERE id = $1", [id]);
  await client.end();
  return { success: true };
}
