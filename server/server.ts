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
app.post("/add-event", (req, res) => {
  try {
    const form = req.body;
    const query = db.query(
      `INSERT INTO tts_events (title, "start", "end", date_added, location, num_of_shops) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        form.title,
        form.start,
        form.end,
        form.date_added,
        form.location,
        form.num_of_shops,
      ],
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
      `SELECT id, title, "start", "end" FROM tts_events;`,
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
    const query = await db.query(
      `
      SELECT 
        e.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', v.id,
              'vehicle_name', v.vehicle_name,
              'vehicle_reg', v.vehicle_reg
            )
          ) FILTER (WHERE v.id IS NOT NULL),
          '[]'
        ) AS vehicles
      FROM tts_events e
      LEFT JOIN event_vehicles ev ON ev.event_id = e.id
      LEFT JOIN vehicles v ON v.id = ev.vehicle_id
      WHERE e.id = $1
      GROUP BY e.id
      `,
      [id],
    );
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
