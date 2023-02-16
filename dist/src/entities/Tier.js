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
exports.Tier = void 0;
const typeorm_1 = require("typeorm");
const Ranking_1 = require("./Ranking");
let Tier = class Tier {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'tinyint', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], Tier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', nullable: true, length: 200 }),
    __metadata("design:type", String)
], Tier.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'image_url', nullable: true, length: 2083 }),
    __metadata("design:type", String)
], Tier.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'start_percent',
        nullable: true,
        precision: 7,
        scale: 4,
    }),
    __metadata("design:type", String)
], Tier.prototype, "startPercent", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'end_percent',
        nullable: true,
        precision: 7,
        scale: 4,
    }),
    __metadata("design:type", String)
], Tier.prototype, "endPercent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ranking_1.Ranking, (ranking) => ranking.tier),
    __metadata("design:type", Array)
], Tier.prototype, "rankings", void 0);
Tier = __decorate([
    (0, typeorm_1.Entity)('tier', { schema: 'git_rank' })
], Tier);
exports.Tier = Tier;
//# sourceMappingURL=Tier.js.map