import { DoneCallback, Job } from "bull";
import { viewPage } from "../controllers/bookingScrapper";
import { Filter } from "../types/filter.type";

function scrapperProccess(job: Job, done: DoneCallback):void {
  try {
    const { range, initDay = 0, adults = 1 } = <Filter>job.data;
    viewPage(range, { adults, initDay })
    .then(() => {
      done();
    })
    .catch(() => {
      done(new Error('error scrapper'));
    })
  } catch (e) {
    done(new Error('error scrapper'));
  }
};

export default scrapperProccess;
