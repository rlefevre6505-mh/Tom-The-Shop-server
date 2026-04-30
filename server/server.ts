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
// add a new event
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

// add note to event
app.post("/add-note", async (req, res) => {
  try {
    const form = req.body;

    await db.query(`INSERT INTO notes (note, event_id) VALUES ($1, $2)`, [
      form.note,
      form.event_id,
    ]);

    res.json({ status: "success", values: form });
  } catch (error) {
    console.error("Error inserting note:", error);
    res.status(500).json({ status: "error", message: "Failed to add note" });
  }
});

// GET REQUESTS
//
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
//
// get event for SelectedEventView
app.post("/selected-event", async function (req, res) {
  try {
    const { id } = req.body;

    const query = await db.query(
      `
      SELECT 
        e.*,
        -- Vehicles
        COALESCE(
          (
            SELECT json_agg(jsonb_build_object(
              'id', v.id,
              'vehicle_name', v.vehicle_name,
              'vehicle_reg', v.vehicle_reg
            ))
            FROM event_vehicles ev
            JOIN vehicles v ON v.id = ev.vehicle_id
            WHERE ev.event_id = e.id
          ),
          '[]'
        ) AS vehicles,
        -- Shops
        COALESCE(
          (
            SELECT json_agg(jsonb_build_object(
              'id', s.id,
              'shop_name', s.shop_name
            ))
            FROM event_shops es
            JOIN shops s ON s.id = es.shop_id
            WHERE es.event_id = e.id
          ),
          '[]'
        ) AS shops,
        -- Notes
        COALESCE(
          (
            SELECT json_agg(jsonb_build_object(
              'note', n.note
            ))
            FROM notes n
            WHERE n.event_id = e.id
          ),
          '[]'
        ) AS notes
      FROM tts_events e
      WHERE e.id = $1
      GROUP BY e.id
      `,
      [id],
    );
    return res.json(query.rows[0]);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
});
//
// get list of all shops
app.get("/get-shops", async function (req, res) {
  try {
    const query = await db.query(`SELECT json_agg(shops) AS shops
FROM shops;`);
    res.json(query.rows[0].shops);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});
//
// get list of all vehicles
app.get("/get-vehicles", async function (req, res) {
  try {
    const query = await db.query(`SELECT json_agg(vehicles) AS vehicles
FROM vehicles;`);
    res.json(query.rows[0].vehicles);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

//START SERVER
app.listen(PORT, () => {
  console.info(`Server is running in port ${PORT}`);
});
