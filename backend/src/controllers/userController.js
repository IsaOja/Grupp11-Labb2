import * as userService from "../services/userService.js";
import bcrypt from "bcrypt";

export async function getUsers(req, res) {
  const users = await userService.getAllUsers();
  res.json({ users });
}

export async function getUser(req, res) {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export async function addUser(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await userService.createUser({
      username,
      firstname,
      lastname,
      email,
      password_hash,
    });
    res.status(201).json({ user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { firstname, lastname, email, password } = req.body;
  const password_hash = password ? await bcrypt.hash(password, 10) : null;
  try {
    const updated = await userService.updateUser(id, {
      firstname,
      lastname,
      email,
      password_hash,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ error: `Sorry couldn't update, please try again.` });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "failed to update" });
  }
}

export async function removeUser(req, res) {
  await userService.deleteUser(req.params.id);
  res.json({ deleted: true });
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username/Email and password are required" });
  }

  try {
    console.log("Attempting login with identifier:", username);
    const user = await userService.getUserByUsernameOrEmail(username);

    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ error: "Invalid username/email or password" });
    }

    console.log("User found, checking password");
    if (!user.password_hash) {
      console.error("No password hash found for user");
      return res.status(500).json({ error: "Account configuration error" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log("Password valid:", validPassword);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
