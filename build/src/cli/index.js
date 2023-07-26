"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = require("commander");
const fs_1 = tslib_1.__importDefault(require("fs"));
const utils_1 = require("../utils");
const program = new commander_1.Command();
program
    .name('Real Estate Crawler')
    .description('CLI for Real Estate Crawler utilities')
    .version('1.0.0');
const commandFiles = fs_1.default
    .readdirSync((0, utils_1.handlePath)('./commands', __dirname))
    .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const { default: command } = require((0, utils_1.handlePath)(`./commands/${file}`, __dirname));
    command(program);
}
program.parse();
//# sourceMappingURL=index.js.map