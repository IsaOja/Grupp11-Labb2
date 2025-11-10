import { getClient } from "../../db.js";

// Read all public wishlists all users
export async function getAllPubWishlists() {
  const client = await getClient();
  // Join with users to include the owner's username so the frontend can display it
  const { rows } = await client.query(`
     SELECT w.id, w.user_id, w.list_title, w.is_private, w.created_at, u.username,
    COUNT(i.id) AS items_count
    FROM wishlists w
    LEFT JOIN users u ON w.user_id = u.id
    LEFT JOIN wishlist_items i ON w.id = i.wishlist_id
    WHERE w.is_private = FALSE
    GROUP BY w.id, u.username
  `);
  await client.end();
  return rows;
}

// Read public wishlists by user
export async function getUserPubWishlists(id) {
  const client = await getClient();
  const q = `
     SELECT w.id, w.user_id, w.list_title, w.is_private, w.created_at,
    COUNT(i.id) AS items_count
    FROM wishlists w
    LEFT JOIN wishlist_items i ON w.id = i.wishlist_id
    WHERE w.is_private = FALSE AND w.user_id = $1
    GROUP BY w.id
  `;
  const { rows } = await client.query(q, [id]);
  await client.end();
  return rows;
}
// Read private Wishlists by user's id
export async function getUserPrivateWishlists(id) {
  const client = await getClient();
  const q = `
     SELECT w.id, w.user_id, w.list_title, w.is_private, w.created_at,
    COUNT(i.id) AS items_count
    FROM wishlists w
    LEFT JOIN wishlist_items i ON w.id = i.wishlist_id
    WHERE w.is_private = TRUE AND w.user_id = $1
    GROUP BY w.id
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
