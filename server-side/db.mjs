import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.USR,
    password: process.env.PASSWORD,
    database: process.env.DB,
  })
  .promise();

// websites
export async function getWebsites() {
  const [rows] = await pool.query("SELECT * FROM website");
  return rows;
}
export async function getWebsite(id) {
  const [rows] = await pool.query(
    `SELECT * FROM website WHERE website_id = ?`,
    [id]
  );
  return rows;
}
export async function addWebsite(website_name, website_url) {
  const result = await pool.query(
    "INSERT INTO website (website_name, website_url) VALUES (?, ?)",
    [website_name, website_url]
  );
  return result;
}

//users
export async function addUser(website_id, user_name, user_email) {
  const result = await pool.query(
    "INSERT INTO Users (website_id, user_name, user_email) VALUES (?, ?, ?)",
    [website_id, user_name, user_email]
  );
  return result;
}

export async function getUsers(website_id) {
  const [rows] = await pool.query(
    "SELECT Users.* FROM Users JOIN website ON Users.website_id = website.website_id WHERE website.website_id = ?;",
    [website_id]
  );
  return rows;
}

//session
export async function addSession(user_id, start_time, end_time) {
  const result = await pool.query(
    "INSERT INTO Sessions (user_id, start_time, end_time) VALUES (?, ?, ?)",
    [user_id, start_time, end_time]
  );
  return result;
}

export async function getSessions(user_id) {
  const [rows] = await pool.query(
    "SELECT Sessions.session_id, Sessions.start_time, Sessions.end_time FROM Sessions JOIN Users ON Sessions.user_id = Users.user_id WHERE Users.user_id = ?;",
    [user_id]
  );
  return rows;
}

//conversation
export async function addConversation(
  session_id,
  query,
  response,
  rating,
  click_links,
  added_products
) {
  const result = await pool.query(
    "INSERT INTO Conversations (session_id, query, response, rating, click_links, added_products) VALUES (?, ?, ?, ?, ?, ?)",
    [session_id, query, response, rating, click_links, added_products]
  );
  return result;
}

export async function getConversation(session_id) {
  const [rows] = await pool.query(
    "SELECT * FROM Conversations WHERE session_id = ?;",
    [session_id]
  );
  return rows;
}

export async function addProduct(
  name,
  color,
  link,
  material,
  description,
  sleeves,
  price
) {
  const result = await pool.query(
    "INSERT INTO products (name, color, link, material, description, sleeves, price) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, color, link, material, description, sleeves, price]
  );
  return result;
}

export async function getProduct(product_id) {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?;", [
    product_id,
  ]);
  return rows;
}

export async function getUserProducts() {
  const [rows] = await pool.query("SELECT * FROM UserProducts;");
  return rows;
}

export async function addUserProducts(user_id, product_id, date) {
  const result = await pool.query(
    "INSERT INTO UserProducts (user_id, product_id, date) VALUES (?, ?)",
    [user_id, product_id, date]
  );

  return result;
}

export function generateSQLInsertStatements(transformedData) {
  const sqlStatements = [];

  Object.entries(transformedData).forEach(([date, products]) => {
    Object.entries(products).forEach(([product_id, clicks]) => {
      const sql = `INSERT INTO forecast (date, product_id, clicks) VALUES ('${date}', ${product_id}, ${clicks});`;
      sqlStatements.push(sql);
    });
  });

  return sqlStatements;
}

export async function executeForecasting(sqlStatements) {
  for (const sql of sqlStatements) {
    try {
      await pool.query(sql);
      console.log(`Successfully executed SQL: ${sql}`);
    } catch (error) {
      console.error(`Error executing SQL: ${sql}`, error);
    }
  }
}
