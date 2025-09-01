"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCouponService = void 0;
const common_1 = require("@nestjs/common");
let UserCouponService = class UserCouponService {
    create(createUserCouponDto) {
        return 'This action adds a new userCoupon';
    }
    findAll() {
        return `This action returns all userCoupon`;
    }
    findOne(id) {
        return `This action returns a #${id} userCoupon`;
    }
    update(id, updateUserCouponDto) {
        return `This action updates a #${id} userCoupon`;
    }
    remove(id) {
        return `This action removes a #${id} userCoupon`;
    }
};
exports.UserCouponService = UserCouponService;
exports.UserCouponService = UserCouponService = __decorate([
    (0, common_1.Injectable)()
], UserCouponService);
//# sourceMappingURL=user-coupon.service.js.map