"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateSubCategoryIdPipe = void 0;
const common_1 = require("@nestjs/common");
let ValidateSubCategoryIdPipe = class ValidateSubCategoryIdPipe {
    async transform(value, metadata) {
        let subCategoryIdMinMax;
        (function (subCategoryIdMinMax) {
            subCategoryIdMinMax[subCategoryIdMinMax["min"] = 1] = "min";
            subCategoryIdMinMax[subCategoryIdMinMax["max"] = 8] = "max";
        })(subCategoryIdMinMax || (subCategoryIdMinMax = {}));
        if (Number.isNaN(value) ||
            value < subCategoryIdMinMax.min ||
            value > subCategoryIdMinMax.max) {
            throw new common_1.BadRequestException('Invalid subCategoryId');
        }
        return value;
    }
};
ValidateSubCategoryIdPipe = __decorate([
    (0, common_1.Injectable)()
], ValidateSubCategoryIdPipe);
exports.ValidateSubCategoryIdPipe = ValidateSubCategoryIdPipe;
//# sourceMappingURL=getPostList.pipe.js.map