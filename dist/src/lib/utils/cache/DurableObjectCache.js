"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DurableObjectCache = void 0;
const ScopedCache_1 = require("./ScopedCache");
class DurableObjectCache extends ScopedCache_1.ScopedCache {
    storage;
    userHash;
    constructor(scope, storage) {
        super(scope);
        this.userHash = scope;
        this.storage = storage;
    }
    getScopedKey(key) {
        return `user:${this.userHash}:${key}`;
    }
    async get(key) {
        const scopedKey = this.getScopedKey(key);
        return await this.storage.get(scopedKey);
    }
    async set(key, value) {
        const scopedKey = this.getScopedKey(key);
        await this.storage.put(scopedKey, value);
    }
    async delete(key) {
        const scopedKey = this.getScopedKey(key);
        await this.storage.delete(scopedKey);
    }
    async clear() {
        const prefix = `user:${this.userHash}:`;
        const keys = await this.storage.list({ prefix });
        const keysArray = Array.from(keys.keys());
        await this.storage.delete(keysArray);
    }
}
exports.DurableObjectCache = DurableObjectCache;
