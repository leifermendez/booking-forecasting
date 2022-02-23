import requestPromise from "request-promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Function parse url and concat
 * @param url
 * @returns string
 */
function parseUrl(url: string): string {
  const SCRAPER_API = process.env.SCRAPER_API || null;
  const PRE_LINK = `http://api.scraperapi.com/?api_key=${SCRAPER_API}&url=`;
  url = url.replace(PRE_LINK,'')
  //http://api.scraperapi.com/?api_key=5b29a4a2839ddd2f7b47c51949de4985&url=http://httpbin.org/ip
  let preUrl = (process.env.SCRAPER_API.length) ? `${PRE_LINK}${url}` : url;
  // const preUrl = `${url}`;
  console.log(preUrl)
  return preUrl;
}

/**
 * CallHTTP with url parse
 * @param url
 * @returns
 */

async function callHttp(url: string): Promise<any> {
  const urlParse = parseUrl(url);
  const responseCall = await requestPromise(urlParse);
  return responseCall;
}

export { callHttp, parseUrl };
