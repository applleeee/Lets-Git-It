"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const community_module_1 = require("./community/community.module");
const rank_module_1 = require("./rank/rank.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const ormConfig = require("../config/ormConfig");
const core_1 = require("@nestjs/core");
const http_exception_filter_1 = require("./utiles/http-exception.filter");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot(ormConfig),
            community_module_1.CommunityModule,
            rank_module_1.RankModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.AllExceptionsFilter,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map