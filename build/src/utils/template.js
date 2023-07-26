"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceTemplate = void 0;
const replaceTemplate = (template, variables) => {
    let newTemplate = template;
    variables.forEach((variable) => {
        const newRegex = new RegExp(variable.replacer, 'g');
        newTemplate = newTemplate.replace(newRegex, variable.value);
    });
    return newTemplate;
};
exports.replaceTemplate = replaceTemplate;
//# sourceMappingURL=template.js.map