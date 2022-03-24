import dotenv from "dotenv";
dotenv.config();
import puppeteer from "puppeteer";
// @ts-ignore
import fullPageScreenshot from "puppeteer-full-page-screenshot";
import { builderUrl } from "./bookingHandle";
import { parseUrl } from "../services/proxy";
import saveData from "../handle/save";
import ScrapperData from "../types/scrapper-data.type";
import { format } from "date-fns";

const TIME_OUT = Number(process.env.TIME_OUT) * 1000;

const CONFIG_PUPPETER = {
  headless: true,
  args: [
    "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1",
    "--window-size=1200,800",
    "--incognito",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-sandbox",
  ],
};

/**
 * Visite page wit puppeteer
 * @param url
 */
async function scrapperAirbnb(
  type: 50 | 100 | 150 | 200,
  config: { adults: number; initDay: number }
): Promise<any> {
  const urlWithProxy = builderUrl(
    type,
    config.adults,
    config.initDay,
    "airbnb"
  );
  const browser = await puppeteer.launch(CONFIG_PUPPETER);
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  page.setDefaultTimeout(TIME_OUT);
  await page.setViewport({ width: 1920, height: 1080 });

  async function scrapperOnly(urlClean: string): Promise<any> {
    let data: ScrapperData[] = [];
    try {
      urlClean = parseUrl(urlClean);
      await page.goto(urlClean); //TODO la url de bookin
      await page.waitForSelector(
        "div[data-plugin-in-point-id^=PAGINATED_HOMES-ExploreSectionWrapper]"
      );

      await page.waitForTimeout(3500);
      const domElements = await page.$$("div[itemprop=itemListElement]");

      for (const child of domElements) {
        const domLinkTitle = await child.$("div[role=group] span[id^=title]");

        const domPrice = await child.$("div[role=group] div[style^=--pricing]");

        const domScore = await child.$("div[role=group] span[role=img]");

        const getName = await page.evaluate(
          (dom) => dom?.innerText,
          domLinkTitle
        );

        const getPrice = await page.evaluate((dom) => {
          const rawPrice = dom?.innerText?.replace(/\n/gi, " ");
          const exp = /\d+/gm;
          const [match] = rawPrice.match(exp) || [0];
          return match;
        }, domPrice);

        const getScore = await page.evaluate((dom) => {
          return dom?.innerText?.replace(/\n/gi, " ") || null;
        }, domScore);

        const { checkIn, checkOut } = urlWithProxy.dates;
        data.push({
          name: getName,
          price: getPrice,
          score: getScore,
          category: "--",
          range: type,
          checkin: [checkIn.day, checkIn.month, checkIn.year].join("/"),
          checkout: [checkOut.day, checkOut.month, checkOut.year].join("/"),
          source: "airbnb",
          dateScrapper: format(new Date(), "dd/MM/yyyy"),
        });

        console.log({ getName, getPrice, getScore });
      }

      saveData(data, `Adult_${config.adults}_InitDay_${config.initDay}`);
      await page.waitForSelector("nav[role=navigation]");
      const [, domPagination] = await page.$$("nav[role=navigation] div");
      await page.waitForTimeout(2500);
      const buttonOnClick = await domPagination.$("a");

      //TODO Boton ultimo de la paginacion

      const isDisabled = await page.evaluate((dom) => {
        return dom === null;
      }, buttonOnClick);

      if (!isDisabled) {
        await buttonOnClick.click();
      }

      if (isDisabled) {
        await fullPageScreenshot(page, { path: `./tmp/${Date.now()}.png` });
        browser.close();
        console.log("Cerrando Browse", isDisabled);
      }

      //TODO Esperamos que cargue la nueva pagina y obtener la url para volver a scraper
      await page.waitForSelector(
        "div[data-plugin-in-point-id^=PAGINATED_HOMES-ExploreSectionWrapper]"
      );
      const nextUrl = page.url();
      await page.waitForTimeout(3500);
      const existNextPage = urlWithProxy.url !== nextUrl;
      const returnData = { existNextPage, nextUrl };
      if (returnData.existNextPage) scrapperOnly(returnData.nextUrl);

      return Promise.resolve(null);
    } catch (e) {
      console.log("Error cerramos puppeter", e);
      browser.close();
      return Promise.reject(null);
    }
  }

  return scrapperOnly(urlWithProxy.url);
}

export { scrapperAirbnb };
