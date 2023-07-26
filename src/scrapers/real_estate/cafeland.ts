import RealEstate from '../../core/RealEstate';
import logger from '../../logger';
import * as cheerio from 'cheerio';
import { fulfilledPromises } from '../../utils';
import RealEstateType from '../../types';

export default interface YourTypeHere extends RealEstateType {
  slug: string;
}

const userAgentsList =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
export default class cafeland extends RealEstate {
  constructor() {
    // Pass axiosConfig to the parent class
    super('cafeland', 'cafeland', {
      baseURL: 'https://nhadat.cafeland.vn/moi-gioi-tai-tp-ho-chi-minh',
    });
  }
  async scrapePage(page: number): Promise<any[]> {
    try {
      const { data } = await this.client.get('/page-' + page, {
        headers: { 'User-Agent': userAgentsList },
      });

      const $ = cheerio.load(data);

      const dataList = $('.row-item');

      return fulfilledPromises(
        dataList.toArray().map(async (el) => {
          const data = $(el);

          const getId = data.find('.images-moigioi a').attr('href').split('-');

          const id = getId[getId.length - 1]
            .split('.html')
            .filter((item) => item !== '')
            .toString();

          const fullName = data.find('.moigioi-fullname a').text().trim();

          const avatar = data.find(' a img').attr('src');

          const email =
            data.find('.moigioi-profile a').attr('data-name') +
            '@' +
            data.find('.moigioi-profile a').attr('data-dm');

          const telephone = data
            .find('.images-moigioi a')
            .attr('href')
            .split('-');

          const phone = telephone[telephone.length - 2];

          const area = data
            .find('.moigioi-profile')
            .text()
            .split(/\r?\n/)[1]
            .split(':')[1]
            .trim();

          let slug = data.find('.images-moigioi a').attr('href');
          if (
            slug ===
            'https://nhadat.cafeland.vn/moi-gioi/tong-thach-chuong-0903784879-273300.html'
          ) {
            slug =
              'https://nhadat.cafeland.vn/moi-gioi/tong-thach-chuong-0979787671-273300.html';
          }
          const fieldOperation = data
            .find('.moigioi-field-operation')
            .text()
            .split(/\r?\n/)
            .filter((item) => item && item.trim() !== '');

          const user: any = {
            slug,
            id,
            fullName,
            avatar,
            area,
            email,
            phone,
            fieldOperation,
          };

          return await fulfilledPromises([this.scrapeDetail(slug, user)]);
        }),
      );
    } catch (error) {
      logger.error(error);
    }
  }

  async scrapeDetail(slug: string, user: any): Promise<any> {
    const rentData = await fulfilledPromises([
      this.scrapeAllPages((page) => this.scrapeRentPage(slug, page)),
    ]);

    return {
      user: user,
      userAsset: rentData.flat(),
    };
  }

  async scrapeRentPage(slug: string, page: number): Promise<any[]> {
    try {
      const { data } = await this.client.get(`${slug}?page=${page}`, {
        headers: { 'User-Agent': userAgentsList },
      });

      const $ = cheerio.load(data);

      const dataList = $('.property-list .row-item');
      console.log(`${slug}?page=${page}`);
      return fulfilledPromises(
        dataList.toArray().map(async (el) => {
          const data = $(el);

          //title
          const title = data.find('.reales-title a').text();

          //price
          const price = data.find('.reales-price').text();

          //preview
          const preview = data.find('.reales-preview').text();

          //more info
          const moreInfore = data.find('.reales-more-info').text();

          //image
          const images = data.find('.images-reales img').attr('src');

          //update time
          const updateTime = data.find('.reals-update-time').text();

          //slug
          const slug = data.find('.reales-title a').attr('href');

          const posts = {
            title,
            price,
            preview,
            moreInfore,
            images,
            updateTime,
          };

          return this.scrapeDetailAsset(slug, posts);
        }),
      );
    } catch (error) {
      logger.error(error);
    }
  }

  async scrapeDetailAsset(slug: string, posts: any): Promise<any> {
    try {
      const { data } = await this.client.get(`${slug}`, {
        headers: { 'User-Agent': userAgentsList },
      });

      const $ = cheerio.load(data);

      //list image
      const imageTags = $('.carousel-inner .carousel-item').find('a');

      const imageUrls = imageTags.map((_, img) => $(img).attr('href')).get();

      //price
      const content = $('.infor-data').map((_, item) => $(item).text());

      //price per square meter
      const squareMeter = $('.infor-note').map((_, item) => $(item).text());

      //description
      const description = $('.blk-content').text();

      //architecture - utility
      // const archi = $('.reals-house-item .title-item').text();
      const uti = $('.value-item').map((_, item) => $(item).text());

      const architecture = {
        addressType: uti[0],
        directionHouse: uti[1],
        floors: uti[2],
        toilets: uti[3],
        roadHouse: uti[4],
        rooms: uti[5],
        bedrooms: uti[6],
        juridical: uti[7],
      };

      // link map
      const map = $('.frame-map iframe').attr('src');

      const detailAsset = {
        imageUrls,
        price: content[0],
        squareMeter: squareMeter[1],
        area: content[1],
        bedroom: content[2],
        description,
        architecture,
        map,
      };

      return { userAsset: posts, detailAsset };
    } catch (error) {
      logger.error(error);
    }
  }
}
