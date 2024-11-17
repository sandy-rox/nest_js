"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let CookieInterceptor = class CookieInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            const res = context.switchToHttp().getResponse();
            const { accessToken, refreshToken } = data;
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                path: '/api/v1/auth/refresh-token',
            });
            return { accessToken };
        }));
    }
};
exports.CookieInterceptor = CookieInterceptor;
exports.CookieInterceptor = CookieInterceptor = __decorate([
    (0, common_1.Injectable)()
], CookieInterceptor);
//# sourceMappingURL=cookie.interceptor.js.map