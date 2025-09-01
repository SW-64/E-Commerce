"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
let CouponService = class CouponService {
    create(createCouponDto) {
        return 'This action adds a new coupon';
    }
    findAll() {
        return `This action returns all coupon`;
    }
    findOne(id) {
        return `This action returns a #${id} coupon`;
    }
    update(id, updateCouponDto) {
        return `This action updates a #${id} coupon`;
    }
    remove(id) {
        return `This action removes a #${id} coupon`;
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)()
], CouponService);
//# sourceMappingURL=coupon.service.js.map