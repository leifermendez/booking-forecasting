import dotenv from "dotenv";
dotenv.config();
import puppeteer from "puppeteer";
// @ts-ignore
import fullPageScreenshot from "puppeteer-full-page-screenshot";
import { builderUrl } from "./bookingHandle";
import { parseUrl } from "../services/proxy";
import getAmount from "../handle/getAmount";
import saveData from "../handle/save";
import ScrapperData from '../types/scrapper-data.type'
import { format } from "date-fns";

const TIME_OUT = Number(process.env.TIME_OUT) * 1000;

const CONFIG_PUPPETER = {
  headless: process.env.DEBUG !== 'false',
  args: [
    "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
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
async function scrapperBooking(
  type: 50 | 100 | 150 | 200,
  config: { adults: number; initDay: number }
): Promise<any> {
  const urlWithProxy = builderUrl(type, config.adults, config.initDay, 'booking');
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
      await page.waitForSelector("div[data-component=arp-properties-list]");

      const domElements = await page.$$("div[data-testid=property-card]");
      const [domPagination] = await page.$x(
        '//div[@data-testid="pagination"]/nav/div'
      );

      for (const child of domElements) {
        const domLinkTitle = await child.$('a[data-testid="title-link"]');
        const domPriceForNight = await child.$(
          'div[data-testid="price-for-x-nights"]'
        );
        const domPriceAndDiscounted = await child.$(
          'div[data-testid="price-and-discounted-price"]'
        );
        const domScore = await child.$('div[data-testid="review-score"]');
        const domRecommended = await child.$(
          'div[data-testid="recommended-units"]'
        );

        const getLink = await page.evaluate(
          (domLinkTitle) => domLinkTitle.getAttribute("href"),
          domLinkTitle
        );

        const getRecommended = await page.evaluate(
          (domRecommended) => domRecommended.innerText,
          domRecommended
        );

        const getScore = await page.evaluate((domScore) => {
          return domScore?.querySelector("div").innerText;
        }, domScore);

        const getName = await page.evaluate((domLinkTitle) => {
          return domLinkTitle?.querySelector('div[data-testid="title"]')
            .innerText;
        }, domLinkTitle);

        const getPriceValue = await page.evaluate(
          (domPriceAndDiscounted) =>
            domPriceAndDiscounted.innerText.replace(
              /( )|(-)|(€)|(USD)|\s/g,
              "_"
            ),
          domPriceAndDiscounted
        );

        const [getCleanPrice] = getAmount(getPriceValue);
        const { checkIn, checkOut } = urlWithProxy.dates;
        data.push({
          name: getName,
          price: getCleanPrice,
          score: getScore,
          category: getRecommended,
          range: type,
          checkin: [checkIn.day, checkIn.month, checkIn.year].join("/"),
          checkout: [checkOut.day, checkOut.month, checkOut.year].join("/"),
          source: "booking",
          dateScrapper: format(new Date(), "dd/MM/yyyy"),
        });
      }

      saveData(data, `Adult_${config.adults}_InitDay_${config.initDay}`);
      await page.waitForSelector("div[data-testid=pagination]");
      await page.waitForTimeout(2500);
      const button = await domPagination.$$("button");

      //TODO Boton ultimo de la paginacion

      // await page.waitForTimeout(222500);
      const buttonOnClick = button[button.length - 1];
      buttonOnClick.getProperty("disabled");
      const isDisabled = await (
        await buttonOnClick.getProperty("disabled")
      ).jsonValue();
      await button[button.length - 1].click();

      //TODO Esperamos que cargue la nueva pagina y obtener la url para volver a scraper
      await page.waitForSelector("div[data-component=arp-properties-list]");
      const nextUrl = page.url();
      const existNextPage = urlWithProxy.url !== nextUrl;
      const returnData = { existNextPage, nextUrl };
      if (isDisabled) {
        await fullPageScreenshot(page, { path: `./tmp/${Date.now()}.png` });
        browser.close();
        console.log("Cerrando Browse");
      }
      if (returnData.existNextPage) scrapperOnly(returnData.nextUrl);
      return Promise.resolve(returnData);
    } catch (e) {
      await fullPageScreenshot(page, { path: `./tmp/${Date.now()}.png` });
      console.log("Error cerramos puppeter", e);
      browser.close();
      return Promise.reject(null);
    }
  }

  return scrapperOnly(urlWithProxy.url);
}

export { scrapperBooking };
