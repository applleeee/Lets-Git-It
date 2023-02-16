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
exports.Career = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Career = class Career {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'tinyint', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], Career.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'period', nullable: false, length: 100 }),
    __metadata("design:type", String)
], Career.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.career),
    __metadata("design:type", Array)
], Career.prototype, "users", void 0);
Career = __decorate([
    (0, typeorm_1.Entity)('career', { schema: 'git_rank' })
], Career);
exports.Career = Career;
//# sourceMappingURL=Career.js.map