import { viewPage } from "./controllers/bookingScrapper";
import dotenv from "dotenv";
dotenv.config();

/**
 * This is main function
 */

function init():void{

    //TODO Scraper booking 100 price

    viewPage(150, {adults:1, initDay:1})
}

init();
