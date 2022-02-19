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
exports.viewPage = void 0;
const proxy_1 = require("../services/proxy");
const puppeteer_1 = __importDefault(require("puppeteer"));
/**
 * Visite page wit puppeteer
 * @param url
 */
function viewPage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlWithProxy = (0, proxy_1.parseUrl)(url);
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1920, height: 1080 });
        yield page.goto(urlWithProxy);
    });
}
exports.viewPage = viewPage;
//# sourceMappingURL=booking.js.map