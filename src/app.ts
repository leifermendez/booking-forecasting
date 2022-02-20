import { viewPage } from "./controllers/bookingScrapper";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

/**
 * This is main function
 */

function init(): void {

  //TODO Cada dia 1AM
  cron.schedule("0 1 * * *", () => {
    viewPage(50, { adults: 1, initDay: 1 });
  });

  cron.schedule("15 1 * * *", () => {
    viewPage(100, { adults: 1, initDay: 1 });
  });

  cron.schedule("35 1 * * *", () => {
    viewPage(150, { adults: 1, initDay: 1 });
  });

  cron.schedule("0 2 * * *", () => {
    viewPage(200, { adults: 1, initDay: 1 });
  });

}

init();
