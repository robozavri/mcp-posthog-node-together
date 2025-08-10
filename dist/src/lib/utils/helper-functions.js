"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
const node_crypto_1 = __importDefault(require("node:crypto"));
function hash(data) {
    return node_crypto_1.default.createHash("sha256").update(data).digest("hex");
}
