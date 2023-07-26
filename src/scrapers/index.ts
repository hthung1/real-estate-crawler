import { handlePath } from '../utils';

import fs from 'fs';
import RealEstate from '../core/RealEstate';

const readScrapers = (path: string) => {
    const scraperFiles = fs
        .readdirSync(handlePath(path))
        .filter((file) => file.endsWith('.js'))
        .map((file) => file.replace('.js', ''));

    const scrapers = {};

    for (const file of scraperFiles) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { default: Scraper } = require(handlePath(`${path}/${file}`));
        scrapers[file] = new Scraper();
    }

    return scrapers;
};

const readClassScrapers = (path: string) => {
    const scraperFiles = fs
        .readdirSync(handlePath(path))
        .filter((file) => file.endsWith('.js'))
        .map((file) => file.replace('.js', ''));

    const scrapers = {};

    for (const file of scraperFiles) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { default: Scraper } = require(handlePath(`${path}/${file}`));

        scrapers[file] = Scraper;
    }

    return scrapers;
};

export type RealEstateId = string;

const realEstateScrapers: Record<RealEstateId, RealEstate> =
    readScrapers('./scrapers/real_estate');
const realEstateClassScrapers: Record<RealEstateId, typeof RealEstate> =
    readClassScrapers('./scrapers/real_estate');


export const getRealEstateScraper = (id: RealEstateId) => {
    if (!(id in realEstateScrapers)) {
        throw new Error(`Unknown scraper id: ${id}`);
    }

    return realEstateScrapers[id];
};

export const getMangaClassScraper = (id: RealEstateId) => {
    if (!(id in realEstateClassScrapers)) {
        return null;
    }

    // @ts-ignore
    return new realEstateClassScrapers[id]();
};

export const getScraper = (id: RealEstateId) => {

    if (id in realEstateScrapers) {
        console.log('Scrapers');
        return getRealEstateScraper(id);
    }

    throw new Error(`Unknown scraper id: ${id}`);
};

export default {
    realEstate: realEstateScrapers,
    realEstateClass: realEstateClassScrapers,
};
