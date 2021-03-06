import { Filter } from "./types/filter.type";
import express from "express";
import { sendScrapperQueue } from "./queues/scrapper.queue";
import { scrapperAirbnb } from "./controllers/airbnbScrapper"
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

/**
 *
 */
app.post("/scrapper-week", (req, res) => {
  const body: Filter = req.body;

  [1, 2, 3, 4, 5, 6, 7].forEach((day) => {
    const mergeFilter = { ...body, ...{ initDay: day } };
    sendScrapperQueue(mergeFilter);
  });
  const data = { status: "ok", msg: "Job to queue Week" };
  res.send(data);
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
