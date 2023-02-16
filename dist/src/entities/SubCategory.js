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
exports.SubCategory = void 0;
const typeorm_1 = require("typeorm");
const Post_1 = require("./Post");
const MainCategory_1 = require("./MainCategory");
let SubCategory = class SubCategory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'tinyint', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], SubCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', nullable: false, length: 200 }),
    __metadata("design:type", String)
], SubCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', {
        name: 'main_category_id',
        nullable: false,
        unsigned: true,
    }),
    __metadata("design:type", Number)
], SubCategory.prototype, "mainCategoryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Post_1.Post, (post) => post.subCategory),
    __metadata("design:type", Array)
], SubCategory.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MainCategory_1.MainCategory, (mainCategory) => mainCategory.subCategories, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'main_category_id', referencedColumnName: 'id' }]),
    __metadata("design:type", MainCategory_1.MainCategory)
], SubCategory.prototype, "mainCategory", void 0);
SubCategory = __decorate([
    (0, typeorm_1.Index)('main_category_id', ['mainCategoryId'], {}),
    (0, typeorm_1.Entity)('sub_category', { schema: 'git_rank' })
], SubCategory);
exports.SubCategory = SubCategory;
//# sourceMappingURL=SubCategory.js.map