import RealEstate from '../../core/RealEstate';
import logger from '../../logger';
import * as cheerio from 'cheerio';
import { fulfilledPromises } from '../../utils';
import RealEstateType from '../../types';

export default interface YourTypeHere extends RealEstateType {}

export default class mogi extends RealEstate {
  constructor() {
    // Pass axiosConfig to the parent class
    super('__id__', '__name__', '__detail__', { baseURL: '' });
  }
  async scrapePage(page: number): Promise<any[]> {}

  async scrapeDetail(slug: string): Promise<any> {}
  async scrapeAsset(): Promise<any> {}
}
