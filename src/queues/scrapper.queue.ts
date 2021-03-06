import Queue from "bull";
import scrapperProccess from "../processes/scrapper.queue";
import { Filter } from "../types/filter.type";

const scrapperQueue = new Queue("scrapper_queue_list", process.env.REDIS_URL);

scrapperQueue.process(scrapperProccess);

function sendScrapperQueue(data: Filter): any {
  console.log("Se agrega a cola", data);
  const { initDay, adults, source = undefined } = data;
  if (source) {
    scrapperQueue.add(
      { range: data.range, adults, initDay, source },
      {
        attempts: 2,
      }
    );
  }
}

export { sendScrapperQueue };
