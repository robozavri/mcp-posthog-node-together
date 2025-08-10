"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteActionSchema = exports.UpdateActionSchema = exports.CreateActionSchema = exports.GetActionSchema = exports.ListActionsSchema = void 0;
const zod_1 = require("zod");
exports.ListActionsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of actions to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of actions to skip"),
});
exports.GetActionSchema = zod_1.z.object({
    actionId: zod_1.z.number().int().positive().describe("Action ID"),
});
exports.CreateActionSchema = zod_1.z.object({
    name: zod_1.z.string().describe("Action name"),
    description: zod_1.z.string().optional().describe("Action description"),
    post_to_slack: zod_1.z.boolean().optional().describe("Whether to post to Slack"),
    slack_message_format: zod_1.z.string().optional().describe("Slack message format"),
    steps: zod_1.z.array(zod_1.z.record(zod_1.z.any())).describe("Action steps/triggers"),
    deleted: zod_1.z.boolean().optional().describe("Whether action is deleted"),
    is_calculating: zod_1.z.boolean().optional().describe("Whether action is calculating"),
    created_by: zod_1.z.record(zod_1.z.any()).optional().describe("Creator information"),
    created_at: zod_1.z.string().optional().describe("Creation date (ISO format)"),
    updated_at: zod_1.z.string().optional().describe("Last update date (ISO format)"),
});
exports.UpdateActionSchema = zod_1.z.object({
    actionId: zod_1.z.number().int().positive().describe("Action ID"),
    name: zod_1.z.string().optional().describe("Action name"),
    description: zod_1.z.string().optional().describe("Action description"),
    post_to_slack: zod_1.z.boolean().optional().describe("Whether to post to Slack"),
    slack_message_format: zod_1.z.string().optional().describe("Slack message format"),
    steps: zod_1.z.array(zod_1.z.record(zod_1.z.any())).optional().describe("Action steps/triggers"),
    deleted: zod_1.z.boolean().optional().describe("Whether action is deleted"),
    is_calculating: zod_1.z.boolean().optional().describe("Whether action is calculating"),
});
exports.DeleteActionSchema = zod_1.z.object({
    actionId: zod_1.z.number().int().positive().describe("Action ID"),
});
