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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankController = void 0;
const common_1 = require("@nestjs/common");
const rank_service_1 = require("./rank.service");
let RankController = class RankController {
    constructor(rankService) {
        this.rankService = rankService;
    }
    async findRanker(userName) {
        return await this.rankService.findRanker(userName);
    }
    async getRankerDetail(userName) {
        return await this.rankService.checkRanker(userName);
    }
    async getTop5() {
        return await this.rankService.getTop5();
    }
    async getTop100(langFilter) {
        return await this.rankService.getTop100(langFilter);
    }
    async compareRanker(userName) {
        const firstUser = await this.rankService.checkRanker(userName[0]);
        const secondUser = await this.rankService.checkRanker(userName[1]);
        return { firstUser, secondUser };
    }
};
__decorate([
    (0, common_1.Get)('/search'),
    __param(0, (0, common_1.Query)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "findRanker", null);
__decorate([
    (0, common_1.Get)('/:userName'),
    __param(0, (0, common_1.Param)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "getRankerDetail", null);
__decorate([
    (0, common_1.Get)('/ranking/top5'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankController.prototype, "getTop5", null);
__decorate([
    (0, common_1.Get)('/ranking/top100'),
    __param(0, (0, common_1.Query)('langFilter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "getTop100", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "compareRanker", null);
RankController = __decorate([
    (0, common_1.Controller)('/ranks'),
    __metadata("design:paramtypes", [rank_service_1.RankService])
], RankController);
exports.RankController = RankController;
//# sourceMappingURL=rank.controller.js.map