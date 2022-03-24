import { DoneCallback, Job } from "bull";
import { scrapperBooking } from "../controllers/bookingScrapper";
import { scrapperAirbnb } from "../controllers/airbnbScrapper";
import { Filter } from "../types/filter.type";

function scrapperProccess(job: Job, done: DoneCallback): void {
  try {
    const { range, initDay = 0, adults = 1, source } = <Filter>job.data;

    if (source == "booking") {
      scrapperBooking(range, { adults, initDay })
        .then(() => {
          done();
        })
        .catch(() => {
          done(new Error("ERROR_BOOKING"));
        });
    }

    if (source == "airbnb") {
      scrapperAirbnb(range, { adults, initDay })
        .then(() => {
          done();
        })
        .catch(() => {
          done(new Error("ERROR_AIRBNB"));
        });
    }
  } catch (e) {
    done(new Error("ERROR_PROCCESS"));
  }
}

export default scrapperProccess;
