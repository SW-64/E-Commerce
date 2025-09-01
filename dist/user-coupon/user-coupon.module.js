"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCouponModule = void 0;
const common_1 = require("@nestjs/common");
const user_coupon_service_1 = require("./user-coupon.service");
const user_coupon_controller_1 = require("./user-coupon.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_coupon_entity_1 = require("./entities/user-coupon.entity");
const user_entity_1 = require("../user/entities/user.entity");
const coupon_entity_1 = require("../coupon/entities/coupon.entity");
let UserCouponModule = class UserCouponModule {
};
exports.UserCouponModule = UserCouponModule;
exports.UserCouponModule = UserCouponModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_coupon_entity_1.UserCoupon, user_entity_1.User, coupon_entity_1.Coupon])],
        controllers: [user_coupon_controller_1.UserCouponController],
        providers: [user_coupon_service_1.UserCouponService],
    })
], UserCouponModule);
//# sourceMappingURL=user-coupon.module.js.map