"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inquirer_1 = require("inquirer");
const utils_1 = require("../../utils");
const template_1 = require("../../utils/template");
exports.default = (program) => {
    return program
        .command('generate')
        .description('Generate scraper file.')
        .action(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const answers = yield (0, inquirer_1.prompt)([
            {
                type: 'input',
                message: 'What is the ID of the scraper?',
                name: 'id',
            },
            {
                type: 'input',
                message: 'What is the name of the scraper?',
                name: 'name',
            },
        ]);
        const templateFileName = 'index.ts';
        const template = (0, utils_1.readFile)(`./src/cli/templates/${templateFileName}`, process.cwd());
        const scraperDirectory = './src/scrapers/real_estate/';
        const scraperFile = `${scraperDirectory}${answers.id}.ts`;
        const replacedTemplate = (0, template_1.replaceTemplate)(template, [
            {
                replacer: '__name__',
                value: answers.name,
            },
            {
                replacer: '__id__',
                value: answers.id,
            },
        ]);
        (0, utils_1.writeFile)(scraperFile, replacedTemplate, process.cwd());
        console.log(`Scraper file generated at ${scraperFile}`);
    }));
};
//# sourceMappingURL=generate.js.map