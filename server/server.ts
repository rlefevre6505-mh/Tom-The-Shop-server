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
//TODO: test for db connection and date functionality
//
app.post("/set-date", (request, response) => {
  try {
    const form = request.body.formValues;
    const query = db.query(
      `INSERT INTO date_test (event_title, start_date, end_date) VALUES ($1, $2, $3)`,
      [form.event_title, form.start_date, form.end_date],
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
    `SELECT event_title, start_date, end_date FROM date_test;`,
  );
  console.log(query.rows);
  const data = response.json(query.rows);
});

//START SERVER
app.listen(PORT, () => {
  console.info(`Server is running in port ${PORT}`);
});
