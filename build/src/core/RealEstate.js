"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Scraper_1 = tslib_1.__importDefault(require("./Scraper"));
const utils_1 = require("../utils");
class RealEstate extends Scraper_1.default {
    constructor(id, name, axiosConfig) {
        super(id, name, axiosConfig);
        this.id = id;
        this.name = name;
    }
    scrapeAllOverViewPages() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.scrapeAllPages(this.scrapePage.bind(this));
            (0, utils_1.writeFile)(`./data/${this.name}/${this.id}.json`, JSON.stringify(data, null, 2));
            return data;
        });
    }
    scrapePage(_page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error('scrapePage Not implemented');
        });
    }
    scrapeRentPage(_slug, _page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error('scrapeDetail Not implemented');
        });
    }
    scrapeDetail(_slug, ..._props) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error('scrapeDetail Not implemented');
        });
    }
}
exports.default = RealEstate;
//# sourceMappingURL=RealEstate.js.map