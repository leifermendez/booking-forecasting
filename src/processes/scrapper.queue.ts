import { DoneCallback, Job } from "bull";
import { scrapperBooking } from "../controllers/bookingScrapper";
import { scrapperAirbnb } from "../controllers/airbnbScrapper";
import { Filter } from "../types/filter.type";

function scrapperProccess(job: Job, done: DoneCallback): void {
  try {
    const { range, initDay = 0, adults = 1, source } = <Filter>job.data;

    switch (source) {
      case "booking":
        scrapperBooking(range, { adults, initDay })
          .then(() => {
            done();
          })
          .catch(() => {
            done(new Error("ERROR_BOOKING"));
          });
        break;
      case "airbnb":
        scrapperAirbnb(range, { adults, initDay })
          .then(() => {
            done();
          })
          .catch(() => {
            done(new Error("ERROR_BOOKING"));
          });
        break;
      default:
        done(new Error("NOT_SOURCE"));
        break;
    }
  } catch (e) {
    done(new Error("ERROR_PROCCESS"));
  }
}

export default scrapperProccess;
