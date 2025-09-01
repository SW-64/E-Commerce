"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserCouponDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_coupon_dto_1 = require("./create-user-coupon.dto");
class UpdateUserCouponDto extends (0, mapped_types_1.PartialType)(create_user_coupon_dto_1.CreateUserCouponDto) {
}
exports.UpdateUserCouponDto = UpdateUserCouponDto;
//# sourceMappingURL=update-user-coupon.dto.js.map