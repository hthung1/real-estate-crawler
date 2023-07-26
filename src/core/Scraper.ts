import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { RequireAtLeastOne } from '../types/ultil';
import axiosRetry from 'axios-retry';
import { errorLogger } from 'axios-logger';
import logger from '../logger';
import { isHTML } from '../utils';

/**
 * class base scraper
 * @param client axios configuration
 * @param id id of the scraper
 * @param getSources a function that returns the sources of the best server
 * @param url url of the client
 * @returns sources
 */

export default class Scraper {
  client: AxiosInstance;
  id: string;
  name: string;
  baseURL: string;
  scrapingPages: number;
  slug: string;

  constructor(
    id: string,
    name: string,
    axiosConfig?: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    const config = {
      headers: {
        referer: axiosConfig.baseURL,
        origin: axiosConfig.baseURL,
      },
      timeout: 20000,
      ...axiosConfig,
    };

    this.client = axios.create(config);
    this.baseURL = axiosConfig.baseURL;
    this.id = id;
    this.name = name;
    this.scrapingPages = 2;

    axiosRetry(this.client, { retries: 3 });

    const axiosErrorLogger = (error: AxiosError) => {
      return errorLogger(error, {
        logger: logger.error.bind(logger),
        // @ts-ignore
        data: !isHTML(error?.response?.data),
      });
    };

    this.client.interceptors.request.use((config) => config, axiosErrorLogger);
    this.client.interceptors.response.use(
      (response) => response,
      axiosErrorLogger,
    );
  }

  // scraper all pages and return list
  protected async scrapeAllPages(
    scrapeFn: (page: number, isNested?: boolean) => Promise<any>,
  ) {
    const list = [];
    let isEnd = false;
    let page = 1;

    while (!isEnd) {
      try {
        if (page === 79) {
          ++page;
        }
        const result = await scrapeFn(page).catch((err) =>
          logger.error('error', err),
        );

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
      } catch (err) {
        isEnd = true;
      }
    }

    return list.flat();
  }
}
