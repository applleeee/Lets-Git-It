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
exports.Field = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Field = class Field {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'tinyint', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], Field.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', nullable: false, length: 100 }),
    __metadata("design:type", String)
], Field.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.field),
    __metadata("design:type", Array)
], Field.prototype, "users", void 0);
Field = __decorate([
    (0, typeorm_1.Entity)('field', { schema: 'git_rank' })
], Field);
exports.Field = Field;
//# sourceMappingURL=Field.js.map