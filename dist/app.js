"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scrapper_queue_1 = require("./queues/scrapper.queue");
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
/**
 * This is main function
 */
// app.post("/scrapper", (req, res) => {
//   const body: Filter = req.body;
//   sendScrapperQueue(body);
//   const data = { status: "ok", msg: "Job to queue" };
//   res.send(data);
// });
/**
 *
 */
app.post("/scrapper-week", (req, res) => {
    const body = req.body;
    [1, 2, 3, 4, 5, 6, 7].forEach((day) => {
        const mergeFilter = Object.assign(Object.assign({}, body), { initDay: day });
        (0, scrapper_queue_1.sendScrapperQueue)(mergeFilter);
    });
    const data = { status: "ok", msg: "Job to queue Week" };
    res.send(data);
});
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
//# sourceMappingURL=app.js.map