"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCache = void 0;
const ScopedCache_1 = require("./ScopedCache");
const _cacheStore = new Map();
class MemoryCache extends ScopedCache_1.ScopedCache {
    cache = new Map();
    constructor(scope) {
        super(scope);
        this.cache = _cacheStore.get(scope) || new Map();
        _cacheStore.set(scope, this.cache);
    }
    async get(key) {
        return this.cache.get(key);
    }
    async set(key, value) {
        this.cache.set(key, value);
        return;
    }
    async delete(key) {
        this.cache.delete(key);
    }
    async clear() {
        this.cache.clear();
    }
}
exports.MemoryCache = MemoryCache;
