import { getClient } from '../../db.js';

// Read all public wishlists all users
export async function getAllPubWishlists() {
  const client = await getClient();
  const { rows } = await client.query(`
    SELECT * from wishlists WHERE is_private = FALSE
    `);
  await client.end();
  return rows;
}

// Read public wishlists by user
export async function getUserPubWishlists(id) {
  const client = await getClient();
  const q = `
    SELECT * FROM wishlists
    WHERE is_private = false AND user_id = $1
  `;
  const { rows } = await client.query(q, [id]);
  await client.end();
  return rows;
}
// Read private Wishlists by user's id
export async function getUserPrivateWishlists(id) {
  const client = await getClient();
  const q = `
    SELECT * FROM wishlists
    WHERE is_private = true AND user_id = $1
  `;
  const { rows } = await client.query(q, [id]);
  await client.end();
  return rows;
}

// Create wishlist
export async function createWishlist({ user_id, list_title, is_private }) {
  const client = await getClient();
  const q = `INSERT INTO wishlists (user_id, list_title, is_private)
  VALUES ($1,$2,$3) 
  RETURNING id, user_id, list_title, is_private, created_at
  `;
  const { rows } = await client.query(q, [user_id, list_title, is_private]);
  await client.end();
  return rows[0];
}

// updatewishlist
export async function updateWishlist(id, { list_title, is_private }) {
  const client = await getClient();
  const q = `UPDATE wishlists SET list_title= $1, is_private=$2 WHERE id = $3
    RETURNING *
  `;
  const { rows } = await client.query(q, [list_title, is_private, id]);
  await client.end();
  return rows[0];
}

// Delete wishlist
export async function deleteWishlist(id) {
  const client = await getClient();
  const q = `DELETE FROM wishlists WHERE id = $1 
    RETURNING id, user_id, list_title, is_private, created_at
  `;
  const { rows } = await client.query(q, [id]);
  await client.end();
  return rows[0];
}
