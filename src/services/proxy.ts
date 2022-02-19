import requestPromise from "request-promise";

/**
 * Function parse url and concat
 * @param url
 * @returns string
 */
function parseUrl(url: string): string {
  const SCRAPER_API = process.env.SCRAPER_API || null;
//   const preUrl = `http://api.scraperapi.com/?api_key=${SCRAPER_API}&url=${url}`;
  const preUrl = `${url}`;
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
