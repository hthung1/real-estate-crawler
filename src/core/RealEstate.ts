import Scraper from './Scraper';
import { AxiosRequestConfig } from 'axios';
import { RequireAtLeastOne } from '../types/ultil';
import { writeFile } from '../utils';
// any type

export interface BaseInfo {
  id: string;
  name: string;
}

export default class RealEstate extends Scraper {
  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);
    this.id = id;
    this.name = name;
  }
  async scrapeAllOverViewPages(): Promise<any[]> {
    const data = await this.scrapeAllPages(this.scrapePage.bind(this));

    writeFile(
      `./data/${this.name}/${this.id}.json`,
      JSON.stringify(data, null, 2),
    );

    return data;
  }

  // over-view
  async scrapePage(_page: number): Promise<any[]> {
    throw new Error('scrapePage Not implemented');
  }
  // detail

  async scrapeRentPage(_slug: string, _page: number): Promise<any> {
    throw new Error('scrapeDetail Not implemented');
  }
  async scrapeDetail(_slug: string, ..._props: any): Promise<any> {
    throw new Error('scrapeDetail Not implemented');
  }
  // // asset
  // async scrapeAsset(): Promise<any> {
  //     throw new Error('scrapeAsset Not implemented');
  // }
}
