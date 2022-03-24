import ScrapperData from "../types/scrapper-data.type";
import saveGoogle from "./google.excel";

 function saveData(data: ScrapperData[], msg:string): void {
    console.log("Saving data...");
    saveGoogle(data)
  }

  export default saveData