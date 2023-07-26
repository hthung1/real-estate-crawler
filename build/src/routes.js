"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
require("dotenv/config");
const router = express_1.default.Router();
router.get('/', (_, res) => {
    res.send('Working yo');
});
exports.default = router;
//# sourceMappingURL=routes.js.map