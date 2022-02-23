import Queue from "bull";
import scrapperProccess from "../processes/scrapper.queue";
import { Filter } from "../types/filter.type";

const scrapperQueue = new Queue("scrapper_queue_list", 'redis://redis:6380');

scrapperQueue.process(scrapperProccess);

function sendScrapperQueue(data: Filter): any {
  console.log("Se agrega a cola", data);
  scrapperQueue.add({ range: data.range, adults: 1 });
}

export { sendScrapperQueue };
