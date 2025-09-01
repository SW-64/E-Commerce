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
exports.UserCoupon = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const coupon_entity_1 = require("../../coupon/entities/coupon.entity");
let UserCoupon = class UserCoupon {
};
exports.UserCoupon = UserCoupon;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserCoupon.prototype, "user_coupon_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.user_coupons, { nullable: false }),
    __metadata("design:type", user_entity_1.User)
], UserCoupon.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coupon_entity_1.Coupon, (coupon) => coupon.user_coupons, { nullable: false }),
    __metadata("design:type", coupon_entity_1.Coupon)
], UserCoupon.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], UserCoupon.prototype, "used_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], UserCoupon.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], UserCoupon.prototype, "created_at", void 0);
exports.UserCoupon = UserCoupon = __decorate([
    (0, typeorm_1.Entity)("user_coupons")
], UserCoupon);
//# sourceMappingURL=user-coupon.entity.js.map