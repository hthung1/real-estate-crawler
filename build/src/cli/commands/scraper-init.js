"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inquirer_1 = require("inquirer");
const scrapers_1 = tslib_1.__importDefault(require("../../scrapers"));
const scrapers_2 = require("../../scrapers");
exports.default = (program) => {
    return program
        .command('scraper:init')
        .description('Init a scraper (If the scraper just created)')
        .action(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = yield (0, inquirer_1.prompt)([
                {
                    type: 'list',
                    message: 'List scraper:',
                    name: 'id',
                    choices: () => {
                        return Object.values(scrapers_1.default.realEstate).map((value) => ({
                            name: value.name,
                            value: value.id,
                        }));
                    },
                },
            ]);
            console.log('Scraping id:', id);
            const scraper = (0, scrapers_2.getScraper)(id);
            console.log('Start scraping (This might take a few hours based on data)');
            scraper.scrapeAllOverViewPages();
            console.log('Scraped successfully');
        }
        catch (err) {
            console.error(err);
            program.error(err.message);
        }
    }));
};
//# sourceMappingURL=scraper-init.js.map