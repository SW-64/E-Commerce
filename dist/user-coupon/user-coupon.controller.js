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
exports.UserCouponController = void 0;
const common_1 = require("@nestjs/common");
const user_coupon_service_1 = require("./user-coupon.service");
const create_user_coupon_dto_1 = require("./dto/create-user-coupon.dto");
const update_user_coupon_dto_1 = require("./dto/update-user-coupon.dto");
let UserCouponController = class UserCouponController {
    constructor(userCouponService) {
        this.userCouponService = userCouponService;
    }
    create(createUserCouponDto) {
        return this.userCouponService.create(createUserCouponDto);
    }
    findAll() {
        return this.userCouponService.findAll();
    }
    findOne(id) {
        return this.userCouponService.findOne(+id);
    }
    update(id, updateUserCouponDto) {
        return this.userCouponService.update(+id, updateUserCouponDto);
    }
    remove(id) {
        return this.userCouponService.remove(+id);
    }
};
exports.UserCouponController = UserCouponController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_coupon_dto_1.CreateUserCouponDto]),
    __metadata("design:returntype", void 0)
], UserCouponController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserCouponController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserCouponController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_coupon_dto_1.UpdateUserCouponDto]),
    __metadata("design:returntype", void 0)
], UserCouponController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserCouponController.prototype, "remove", null);
exports.UserCouponController = UserCouponController = __decorate([
    (0, common_1.Controller)('user-coupon'),
    __metadata("design:paramtypes", [user_coupon_service_1.UserCouponService])
], UserCouponController);
//# sourceMappingURL=user-coupon.controller.js.map