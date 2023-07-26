"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fulfilledPromises = exports.readFile = exports.writeFile = exports.handlePath = exports.isHTML = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const isHTML = (str) => {
    return /<[a-z][\s\S]*>/i.test(str);
};
exports.isHTML = isHTML;
const handlePath = (filePath, baseUrl = path_1.default.resolve(process.cwd(), './build/src')) => path_1.default.join(baseUrl, filePath);
exports.handlePath = handlePath;
const writeFile = (filePath, data, basePath) => {
    const pathname = filePath.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, '');
    const pathDir = (0, exports.handlePath)(pathname, basePath);
    if (!fs_1.default.existsSync(pathDir)) {
        fs_1.default.mkdirSync(pathDir, { recursive: true });
    }
    const fileDir = (0, exports.handlePath)(filePath, basePath);
    fs_1.default.writeFileSync(fileDir, data, { flag: 'w' });
};
exports.writeFile = writeFile;
const readFile = (filePath, basePath) => {
    const fileDir = (0, exports.handlePath)(filePath, basePath);
    if (!fs_1.default.existsSync(fileDir))
        return null;
    return fs_1.default.readFileSync(fileDir, 'utf-8');
};
exports.readFile = readFile;
const fulfilledPromises = (promises) => Promise.allSettled(promises).then((results) => results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value));
exports.fulfilledPromises = fulfilledPromises;
//# sourceMappingURL=index.js.map