import express from "express";
import cors from "cors";
import { db } from "./dbconnections.js";

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
  const reviewForm = request.body.formValues;
  const query = db.query(`INSERT INTO date_test () VALUES ($1)`, [
    reviewForm.date,
  ]);
  response.json({ staus: "success", values: reviewForm });
});

// GET REQUESTS
//
app.get("/stored-events", async function (request, response) {
  const query = await db.query(
    `SELECT name, location, date_in, date_out, comments FROM hotelreviews;`,
  );
  console.log(query.rows);
  const data = response.json(query.rows);
});

app.listen(PORT, () => {
  console.info(`Server is running in port ${PORT}`);
});
