"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const routes_1 = tslib_1.__importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ limit: '500mb' }));
app.use(`/${process.env.BASE_ROUTE}`, routes_1.default);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=main.js.map