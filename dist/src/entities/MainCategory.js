"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainCategory = void 0;
const typeorm_1 = require("typeorm");
const SubCategory_1 = require("./SubCategory");
let MainCategory = class MainCategory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'tinyint', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], MainCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', nullable: false, length: 200 }),
    __metadata("design:type", String)
], MainCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubCategory_1.SubCategory, (subCategory) => subCategory.mainCategory),
    __metadata("design:type", Array)
], MainCategory.prototype, "subCategories", void 0);
MainCategory = __decorate([
    (0, typeorm_1.Entity)('main_category', { schema: 'git_rank' })
], MainCategory);
exports.MainCategory = MainCategory;
//# sourceMappingURL=MainCategory.js.map