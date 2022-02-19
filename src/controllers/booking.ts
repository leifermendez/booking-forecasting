import { parseUrl } from "../services/proxy";
import saveExcel from "../handle/excel";
import puppeteer from "puppeteer";

/**
 * Visite page wit puppeteer
 * @param url
 */
async function viewPage(url: string): Promise<any> {
  let data: Array<any> = [];

  const urlWithProxy = parseUrl(url);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.setDefaultTimeout(500000);
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(urlWithProxy);

  await page.waitForSelector("div[data-component=arp-properties-list]");
  await page.waitForSelector("div[data-testid=pagination]");

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
      return domLinkTitle?.querySelector('div[data-testid="title"]').innerText;
    }, domLinkTitle);

    const getPriceValue = await page.evaluate(
      (domPriceAndDiscounted) => domPriceAndDiscounted.innerText,
      domPriceAndDiscounted
    );

    data.push({
      name: getName,
      link: getLink,
      price: getPriceValue,
      score: getScore,
      category: getRecommended,
    });

    console.log(getPriceValue); //€ 330, € 360€ 333
  }

  await page.waitForTimeout(2500);
  const button = await domPagination.$$("button");

  //TODO Boton ultimo de la paginacion
  await button[6].click();

  //TODO Esperamos que cargue la nueva pagina y obtener la url para volver a scraper
  await page.waitForSelector("div[data-component=arp-properties-list]");
  const nextUrl = page.url();
  const existNextPage = url !== nextUrl;
  saveExcel(data)
}

export { viewPage };
