"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const RealEstate_1 = tslib_1.__importDefault(require("../../core/RealEstate"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const cheerio = tslib_1.__importStar(require("cheerio"));
const utils_1 = require("../../utils");
const userAgentsList = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
class cafeland extends RealEstate_1.default {
    constructor() {
        super('cafeland', 'cafeland', {
            baseURL: 'https://nhadat.cafeland.vn/moi-gioi-tai-tp-ho-chi-minh',
        });
    }
    scrapePage(page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.client.get('/page-' + page, {
                    headers: { 'User-Agent': userAgentsList },
                });
                const $ = cheerio.load(data);
                const dataList = $('.row-item');
                return (0, utils_1.fulfilledPromises)(dataList.toArray().map((el) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const data = $(el);
                    const getId = data.find('.images-moigioi a').attr('href').split('-');
                    const id = getId[getId.length - 1]
                        .split('.html')
                        .filter((item) => item !== '')
                        .toString();
                    const fullName = data.find('.moigioi-fullname a').text().trim();
                    const avatar = data.find(' a img').attr('src');
                    const email = data.find('.moigioi-profile a').attr('data-name') +
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
                    if (slug ===
                        'https://nhadat.cafeland.vn/moi-gioi/tong-thach-chuong-0903784879-273300.html') {
                        slug =
                            'https://nhadat.cafeland.vn/moi-gioi/tong-thach-chuong-0979787671-273300.html';
                    }
                    const fieldOperation = data
                        .find('.moigioi-field-operation')
                        .text()
                        .split(/\r?\n/)
                        .filter((item) => item && item.trim() !== '');
                    const user = {
                        slug,
                        id,
                        fullName,
                        avatar,
                        area,
                        email,
                        phone,
                        fieldOperation,
                    };
                    return yield (0, utils_1.fulfilledPromises)([this.scrapeDetail(slug, user)]);
                })));
            }
            catch (error) {
                logger_1.default.error(error);
            }
        });
    }
    scrapeDetail(slug, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rentData = yield (0, utils_1.fulfilledPromises)([
                this.scrapeAllPages((page) => this.scrapeRentPage(slug, page)),
            ]);
            return {
                user: user,
                userAsset: rentData.flat(),
            };
        });
    }
    scrapeRentPage(slug, page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.client.get(`${slug}?page=${page}`, {
                    headers: { 'User-Agent': userAgentsList },
                });
                const $ = cheerio.load(data);
                const dataList = $('.property-list .row-item');
                console.log(`${slug}?page=${page}`);
                return (0, utils_1.fulfilledPromises)(dataList.toArray().map((el) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const data = $(el);
                    const title = data.find('.reales-title a').text();
                    const price = data.find('.reales-price').text();
                    const preview = data.find('.reales-preview').text();
                    const moreInfore = data.find('.reales-more-info').text();
                    const images = data.find('.images-reales img').attr('src');
                    const updateTime = data.find('.reals-update-time').text();
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
                })));
            }
            catch (error) {
                logger_1.default.error(error);
            }
        });
    }
    scrapeDetailAsset(slug, posts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.client.get(`${slug}`, {
                    headers: { 'User-Agent': userAgentsList },
                });
                const $ = cheerio.load(data);
                const imageTags = $('.carousel-inner .carousel-item').find('a');
                const imageUrls = imageTags.map((_, img) => $(img).attr('href')).get();
                const content = $('.infor-data').map((_, item) => $(item).text());
                const squareMeter = $('.infor-note').map((_, item) => $(item).text());
                const description = $('.blk-content').text();
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
            }
            catch (error) {
                logger_1.default.error(error);
            }
        });
    }
}
exports.default = cafeland;
//# sourceMappingURL=cafeland.js.map