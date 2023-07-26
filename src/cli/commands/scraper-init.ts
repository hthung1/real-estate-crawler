import { Command } from 'commander';
import { prompt } from 'inquirer';
import scrapers from '../../scrapers';
import { getScraper } from '../../scrapers';
// import RealEstate from '../../core/RealEstate';
// import { readFile } from '../../utils';
export default (program: Command) => {
  return program
    .command('scraper:init')
    .description('Init a scraper (If the scraper just created)')
    .action(async () => {
      try {
        const { id } = await prompt([
          {
            type: 'list',
            message: 'List scraper:',
            name: 'id',
            choices: () => {
              return Object.values(scrapers.realEstate).map((value) => ({
                name: value.name,
                value: value.id,
              }));
            },
          },
        ]);
        console.log('Scraping id:', id);
        const scraper = getScraper(id);
        console.log(
          'Start scraping (This might take a few hours based on data)',
        );
        scraper.scrapeAllOverViewPages();
        console.log('Scraped successfully');
      } catch (err) {
        console.error(err);
        program.error(err.message);
      }
    });
};
