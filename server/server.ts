import express from "express";
import cors from "cors";
import { db } from "./dbconnection";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8080;
app.get("/", (request, response) =>
  response.json({ message: "Welcome to the Tom The Shop Logistics server" }),
);

// POST REQUESTS
//
app.post("/set-date", (request, response) => {
  try {
    const form = request.body;

    // TODO: add "await"
    const query = db.query(
      `INSERT INTO date_test (title, "start", "end") VALUES ($1, $2, $3)`,
      [form.title, form.start, form.end],
    );
    response.json({ status: "success", values: form });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

// GET REQUESTS
//
app.get("/stored-events", async function (request, response) {
  const query = await db.query(
    `SELECT id, title, "start", "end" FROM date_test;`,
  );
  console.log(query.rows);
  const data = response.json(query.rows);
});

//START SERVER
app.listen(PORT, () => {
  console.info(`Server is running in port ${PORT}`);
});
