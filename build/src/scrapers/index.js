"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScraper = exports.getMangaClassScraper = exports.getRealEstateScraper = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
const fs_1 = tslib_1.__importDefault(require("fs"));
const readScrapers = (path) => {
    const scraperFiles = fs_1.default
        .readdirSync((0, utils_1.handlePath)(path))
        .filter((file) => file.endsWith('.js'))
        .map((file) => file.replace('.js', ''));
    const scrapers = {};
    for (const file of scraperFiles) {
        const { default: Scraper } = require((0, utils_1.handlePath)(`${path}/${file}`));
        scrapers[file] = new Scraper();
    }
    return scrapers;
};
const readClassScrapers = (path) => {
    const scraperFiles = fs_1.default
        .readdirSync((0, utils_1.handlePath)(path))
        .filter((file) => file.endsWith('.js'))
        .map((file) => file.replace('.js', ''));
    const scrapers = {};
    for (const file of scraperFiles) {
        const { default: Scraper } = require((0, utils_1.handlePath)(`${path}/${file}`));
        scrapers[file] = Scraper;
    }
    return scrapers;
};
const realEstateScrapers = readScrapers('./scrapers/real_estate');
const realEstateClassScrapers = readClassScrapers('./scrapers/real_estate');
const getRealEstateScraper = (id) => {
    if (!(id in realEstateScrapers)) {
        throw new Error(`Unknown scraper id: ${id}`);
    }
    return realEstateScrapers[id];
};
exports.getRealEstateScraper = getRealEstateScraper;
const getMangaClassScraper = (id) => {
    if (!(id in realEstateClassScrapers)) {
        return null;
    }
    return new realEstateClassScrapers[id]();
};
exports.getMangaClassScraper = getMangaClassScraper;
const getScraper = (id) => {
    if (id in realEstateScrapers) {
        console.log('Scrapers');
        return (0, exports.getRealEstateScraper)(id);
    }
    throw new Error(`Unknown scraper id: ${id}`);
};
exports.getScraper = getScraper;
exports.default = {
    realEstate: realEstateScrapers,
    realEstateClass: realEstateClassScrapers,
};
//# sourceMappingURL=index.js.map