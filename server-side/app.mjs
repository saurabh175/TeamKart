import express, { json, response } from "express";
import {
  getWebsites,
  addWebsite,
  addUser,
  getUsers,
  getSessions,
  addSession,
  addConversation,
  getConversation,
  getProduct,
  addProduct,
  getUserProducts,
  addUserProducts,
  generateSQLInsertStatements,
  executeForecasting,
} from "./db.mjs";
const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

app.get("/websites", async (req, res) => {
  const websites = await getWebsites();
  res.status(200).send(websites);
});

app.post("/websites", async (req, res) => {
  const { website_name, website_url } = req.body;
  try {
    await addWebsite(website_name, website_url);
    res.status(200).send("website added successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// users
app.post("/users", async (req, res) => {
  const { website_id, user_name, user_email } = req.body;
  try {
    await addUser(website_id, user_name, user_email);
    res.status(200).send("user added successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/users", async (req, res) => {
  const { website_id } = req.body;
  try {
    const users = await getUsers(website_id);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//sessions
app.post("/sessions", async (req, res) => {
  const { user_id, start_time, end_time } = req.body;
  try {
    await addSession(user_id, start_time, end_time);
    res.status(200).send("session added successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/sessions", async (req, res) => {
  const { user_id } = req.body;
  try {
    const session = await getSessions(user_id);
    res.status(200).send(session);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//conversations
app.post("/conversations", async (req, res) => {
  const { session_id, query, response, rating, click_links, added_products } =
    req.body;
  try {
    await addConversation(
      session_id,
      query,
      response,
      rating,
      click_links,
      added_products
    );
    res.status(200).send("conversation added successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/conversations", async (req, res) => {
  const { session_id } = req.body;
  try {
    const conversation = await getConversation(session_id);
    res.status(200).send(conversation);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// products
app.post("/products", async (req, res) => {
  const { name, color, link, material, description, sleeves, price } = req.body;
  try {
    await addProduct(name, color, link, material, description, sleeves, price);
    res.status(200).send("product added successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/products", async (req, res) => {
  const { product_id } = req.body;
  try {
    const product = await getProduct(product_id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/analytics", async (req, res) => {
  try {
    const inputData = await getUserProducts();
    // var userAnalytics = new Map();
    // var productAnalytics = new Map();
    const transformedData = {};

    inputData.forEach(({ product_id, date }) => {
      const formattedDate = new Date(date).toISOString().split("T")[0];

      if (transformedData[formattedDate]) {
        if (transformedData[formattedDate][product_id]) {
          transformedData[formattedDate][product_id]++;
        } else {
          transformedData[formattedDate][product_id] = 1;
        }
      } else {
        transformedData[formattedDate] = { [product_id]: 1 };
      }
    });

    const statements = generateSQLInsertStatements(transformedData);
    await executeForecasting(statements);

    res.status(200).send("analytics added successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/analytics", async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await addUserProducts(user_id, product_id);
    res.status(200).send("analytics added successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
