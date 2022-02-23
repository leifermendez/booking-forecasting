import { Filter } from "./types/filter.type";
import express from "express";
import { sendScrapperQueue } from "./queues/scrapper.queue";
const PORT = process.env.PORT || 3000
const app = express();
app.use(express.json());
/**
 * This is main function
 */

app.post("/scrapper", (req, res) => {
  const body: Filter = req.body;
  sendScrapperQueue(body);
  // viewPage(100, { adults:1, initDay:1 });
  const data = { status: "ok", msg:"Job to queue" }
  res.send(data);
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
