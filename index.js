import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

// 1. CREATE DATABASE CONNECTTION
const db = new pg.Client({
  user: "vernon",
  host: "localhost",
  database: "permalist",
  password: "admin",
  port: 5432,
});
// 2. connect db lol
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
async function getCurrentItems() {
  const result = await db.query("SELECT * FROM items");
  let itemsArray = [];
  console.log(itemsArray, result.rows);
  result.rows.forEach((item) => {
    itemsArray.push(item);
  });
  return itemsArray;
}
app.get("/", async (req, res) => {
  let itemList = await getCurrentItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: itemList,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    const result = await db.query(
      `INSERT INTO items (title) VALUES ($$'${item}'$$)`
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;
  try {
    const result = await db.query(
      "UPDATE items SET title = ($1) WHERE id = $2",[updatedItemTitle, itemId]
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  try {
    const result = await db.query(
      `DELETE FROM items WHERE id = '${deleteItemId}'`
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
