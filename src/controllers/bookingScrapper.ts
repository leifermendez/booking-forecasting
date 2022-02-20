import saveExcel from "../handle/excel";
import puppeteer from "puppeteer";
import { builderUrl } from "./bookingHandle";
import { insertRow } from "../handle/supabase";


const CONFIG_PUPPETER = {
  headless: true,
  args: [
    '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    '--window-size=1200,800'
  ]
}

/**
 * Visite page wit puppeteer
 * @param url
 */
async function viewPage(type: 50 | 100 | 150 | 200, config:{adults:number, initDay:number}): Promise<any> {


  const urlWithProxy = builderUrl(type, config.adults, config.initDay);
  const browser = await puppeteer.launch(CONFIG_PUPPETER);
  const page = await browser.newPage();
  page.setDefaultTimeout(40000);
  await page.setViewport({ width: 1920, height: 1080 });

  async function scrapperOnly(urlClean:string): Promise<any> {
    let data: Array<any> = [];
    try{
      await page.goto(urlClean);
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
          return domLinkTitle?.querySelector('div[data-testid="title"]')
            .innerText;
        }, domLinkTitle);
  
        const getPriceValue = await page.evaluate(
          (domPriceAndDiscounted) => domPriceAndDiscounted.innerText.replace(' ','').split('€').join(' - '),
          domPriceAndDiscounted
        );
  
        const { checkIn, checkOut } = urlWithProxy.dates;
        data.push({
          name: getName,
          link: getLink,
          price: getPriceValue,
          score: getScore,
          category: getRecommended,
          range:type,
          checkin: [checkIn.day, checkIn.month, checkIn.year].join("/"),
          checkout: [checkOut.day, checkOut.month, checkOut.year].join("/"),
        });
      }

      await page.waitForTimeout(2500);
      const button = await domPagination.$$("button");
  
      //TODO Boton ultimo de la paginacion
      
      // await page.waitForTimeout(222500);
      const buttonOnClick = button[button.length -1];
      buttonOnClick.getProperty('disabled')
      const isDisabled = await (await buttonOnClick.getProperty('disabled')).jsonValue()
      await button[button.length -1].click();
  
      //TODO Esperamos que cargue la nueva pagina y obtener la url para volver a scraper
      await page.waitForSelector("div[data-component=arp-properties-list]");
      const nextUrl = page.url();
      const existNextPage = urlWithProxy.url !== nextUrl;
      saveExcel(data);
      insertRow(data);
      const returnData = { existNextPage, nextUrl };
      if(isDisabled) {
        browser.close();
        return 
      }
      if(returnData.existNextPage) scrapperOnly(returnData.nextUrl);
      return Promise.resolve(returnData);
    }catch(e){
      browser.close();
      console.log('Error cerramos puppeter',e )
      return Promise.reject(null)
    } 

  }

  await scrapperOnly(urlWithProxy.url);
 
}

export { viewPage };
