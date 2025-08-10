"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostHogClient = void 0;
const posthog_node_1 = require("posthog-node");
let _client;
const getPostHogClient = () => {
    if (!_client) {
        _client = new posthog_node_1.PostHog("sTMFPsFhdP1Ssg", { host: 'https://us.i.posthog.com', flushAt: 1, flushInterval: 0 });
    }
    return _client;
};
exports.getPostHogClient = getPostHogClient;
