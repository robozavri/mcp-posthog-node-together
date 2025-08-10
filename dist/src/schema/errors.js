"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDetailsSchema = exports.ListErrorsSchema = exports.StatusErrors = exports.OrderDirectionErrors = exports.OrderByErrors = void 0;
const zod_1 = require("zod");
var OrderByErrors;
(function (OrderByErrors) {
    OrderByErrors["Occurrences"] = "occurrences";
    OrderByErrors["FirstSeen"] = "first_seen";
    OrderByErrors["LastSeen"] = "last_seen";
    OrderByErrors["Users"] = "users";
    OrderByErrors["Sessions"] = "sessions";
})(OrderByErrors || (exports.OrderByErrors = OrderByErrors = {}));
var OrderDirectionErrors;
(function (OrderDirectionErrors) {
    OrderDirectionErrors["Ascending"] = "ASC";
    OrderDirectionErrors["Descending"] = "DESC";
})(OrderDirectionErrors || (exports.OrderDirectionErrors = OrderDirectionErrors = {}));
var StatusErrors;
(function (StatusErrors) {
    StatusErrors["Active"] = "active";
    StatusErrors["Resolved"] = "resolved";
    StatusErrors["All"] = "all";
    StatusErrors["Suppressed"] = "suppressed";
})(StatusErrors || (exports.StatusErrors = StatusErrors = {}));
exports.ListErrorsSchema = zod_1.z.object({
    orderBy: zod_1.z.nativeEnum(OrderByErrors).optional(),
    dateFrom: zod_1.z.date().optional(),
    dateTo: zod_1.z.date().optional(),
    orderDirection: zod_1.z.nativeEnum(OrderDirectionErrors).optional(),
    filterTestAccounts: zod_1.z.boolean().optional(),
    // limit: z.number().optional(),
    status: zod_1.z.nativeEnum(StatusErrors).optional(),
    // TODO: assigned to
});
exports.ErrorDetailsSchema = zod_1.z.object({
    issueId: zod_1.z.string(),
    dateFrom: zod_1.z.date().optional(),
    dateTo: zod_1.z.date().optional(),
});
