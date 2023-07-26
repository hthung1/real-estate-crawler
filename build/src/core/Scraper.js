"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const axios_retry_1 = tslib_1.__importDefault(require("axios-retry"));
const axios_logger_1 = require("axios-logger");
const logger_1 = tslib_1.__importDefault(require("../logger"));
const utils_1 = require("../utils");
class Scraper {
    constructor(id, name, axiosConfig) {
        const config = Object.assign({ headers: {
                referer: axiosConfig.baseURL,
                origin: axiosConfig.baseURL,
            }, timeout: 20000 }, axiosConfig);
        this.client = axios_1.default.create(config);
        this.baseURL = axiosConfig.baseURL;
        this.id = id;
        this.name = name;
        this.scrapingPages = 2;
        (0, axios_retry_1.default)(this.client, { retries: 3 });
        const axiosErrorLogger = (error) => {
            var _a;
            return (0, axios_logger_1.errorLogger)(error, {
                logger: logger_1.default.error.bind(logger_1.default),
                data: !(0, utils_1.isHTML)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data),
            });
        };
        this.client.interceptors.request.use((config) => config, axiosErrorLogger);
        this.client.interceptors.response.use((response) => response, axiosErrorLogger);
    }
    scrapeAllPages(scrapeFn) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const list = [];
            let isEnd = false;
            let page = 1;
            while (!isEnd) {
                try {
                    if (page === 79) {
                        ++page;
                    }
                    const result = yield scrapeFn(page).catch((err) => logger_1.default.error('error', err));
                    if (!result) {
                        isEnd = true;
                        break;
                    }
                    console.log(`Scraped page ${page} - ${this.id}`);
                    if (result.length === 0) {
                        isEnd = true;
                        break;
                    }
                    page++;
                    list.push(result);
                }
                catch (err) {
                    isEnd = true;
                }
            }
            return list.flat();
        });
    }
}
exports.default = Scraper;
//# sourceMappingURL=Scraper.js.map