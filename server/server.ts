import express from "express";
import cors from "cors";
import { db } from "./dbconnection";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8080;
app.get("/", (req, res) =>
  res.json({ message: "Welcome to the Tom The Shop Logistics server" }),
);

// POST REQUESTS
//
app.post("/set-date", (req, res) => {
  try {
    const form = req.body;
    const query = db.query(
      `INSERT INTO date_test (title, "start", "end") VALUES ($1, $2, $3)`,
      [form.title, form.start, form.end],
    );
    res.json({ status: "success", values: form });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

// GET REQUESTS
// get all events for CalendarView
app.get("/stored-events", async function (req, res) {
  try {
    const query = await db.query(
      `SELECT id, title, "start", "end" FROM date_test;`,
    );
    const data = res.json(query.rows);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});
// get event for SelectedEventView
app.post("/selected-event", async function (req, res) {
  try {
    const { id } = req.body;
    const query = await db.query(`SELECT * FROM date_test WHERE id = $1;`, [
      id,
    ]);
    const data = res.json(query.rows[0]);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
});

//START SERVER
app.listen(PORT, () => {
  console.info(`Server is running in port ${PORT}`);
});
