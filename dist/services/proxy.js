"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = exports.callHttp = void 0;
const request_promise_1 = __importDefault(require("request-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Function parse url and concat
 * @param url
 * @returns string
 */
function parseUrl(url) {
    const SCRAPER_API = process.env.SCRAPER_API || null;
    const PRE_LINK = `http://api.scraperapi.com/?api_key=${SCRAPER_API}&url=`;
    url = url.replace(PRE_LINK, '');
    //http://api.scraperapi.com/?api_key=5b29a4a2839ddd2f7b47c51949de4985&url=http://httpbin.org/ip
    let preUrl = (process.env.SCRAPER_API.length) ? `${PRE_LINK}${url}` : url;
    // const preUrl = `${url}`;
    // console.log(preUrl)
    return preUrl;
}
exports.parseUrl = parseUrl;
/**
 * CallHTTP with url parse
 * @param url
 * @returns
 */
function callHttp(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlParse = parseUrl(url);
        const responseCall = yield (0, request_promise_1.default)(urlParse);
        return responseCall;
    });
}
exports.callHttp = callHttp;
//# sourceMappingURL=proxy.js.map