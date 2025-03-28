import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import env from "dotenv";

env.config();
const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;
const { Pool } = pg;
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res) => {
    return res.status(429).json({
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Middleware verifying token");
  if (!token) {
    console.log("No Token Found");
    return res
      .status(403)
      .json({ message: "Unauthorized access, no token found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user_info) => {
    if (err) {
      console.log("Error verifying token: " + err);
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user_info = user_info;
    console.log("Middleware Authenticated User");
    next();
  });
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }
  try {
    const query = "SELECT * FROM users WHERE user_email = $1";
    const values = [email];
    const user = await pool.query(query, values);

    if (user.rows.length === 0) {
      console.log("console logs:Invalid Email");
      return res.status(400).json({ message: "Invalid Email" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      console.log("console logs:Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 3600000,
    });

    console.log(
      "console logs User logged in successfully:",
      user.rows[0].user_email,
      user.rows[0].user_id
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.rows[0].user_id,
        user_email: user.rows[0].user_email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/register", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query =
      "INSERT INTO users (user_email, user_password) VALUES ($1, $2) RETURNING *";
    const values = [email, hashedPassword];
    const newUser = await pool.query(query, values);
    console.log("User Inserted Successfully");
    console.log("console logs:", newUser.rows[0]);

    const token = jwt.sign(
      { userId: newUser.rows[0].user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      console.error("ERROR:", error.message, "ERROR CODE:", error.code);
      return res.status(400).json({ message: "Email already exists." });
    } else if (error.code === "23514") {
      console.error("ERROR:", error.message, "ERROR CODE:", error.code);
      return res.status(400).json({ message: "Email is in wrong format." });
    }
    console.error("Error inserting user", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/all", verifyToken, async (req, res) => {
  console.log("Authenticated User in /all path:", req.user_info);
  try {
    const query = "SELECT * FROM items ORDER BY item_id ";
    const items = await pool.query(query);
    console.log("items", items.rows);
    res.status(200).json({ items: items.rows });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/searched", verifyToken, async (req, res) => {
  const { searchParams } = req.query;
  console.log(searchParams);
  try {
    // Normalize spaces by removing all spaces and convert to lowercase
    const normalizedSearchParams = `%${searchParams
      .toLowerCase()
      .replace(/\s+/g, "")}%`; // Remove spaces

    // Use LOWER(), REPLACE() and LIKE for case-insensitive, space-insensitive, partial matching
    const query =
      "SELECT * FROM items WHERE REPLACE(LOWER(item_name), ' ', '') LIKE $1 ORDER BY item_id";

    const items = await pool.query(query, [normalizedSearchParams]);

    if (items.rows.length > 0) {
      console.log("items", items.rows);
      res.status(200).json({ items: items.rows });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/single/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Use parameterized queries to prevent SQL injection
    const query = "SELECT * FROM items WHERE item_id = $1";
    const items = await pool.query(query, [id]);
    console.log("items", items.rows);

    if (items.rows.length > 0) {
      res.status(200).json(items.rows);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
