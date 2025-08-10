import { z } from "zod";

export const ListActionsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of actions to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of actions to skip"),
});

export const GetActionSchema = z.object({
	actionId: z.number().int().positive().describe("Action ID"),
});

export const CreateActionSchema = z.object({
	name: z.string().describe("Action name"),
	description: z.string().optional().describe("Action description"),
	post_to_slack: z.boolean().optional().describe("Whether to post to Slack"),
	slack_message_format: z.string().optional().describe("Slack message format"),
	steps: z.array(z.record(z.any())).describe("Action steps/triggers"),
	deleted: z.boolean().optional().describe("Whether action is deleted"),
	is_calculating: z.boolean().optional().describe("Whether action is calculating"),
	created_by: z.record(z.any()).optional().describe("Creator information"),
	created_at: z.string().optional().describe("Creation date (ISO format)"),
	updated_at: z.string().optional().describe("Last update date (ISO format)"),
});

export const UpdateActionSchema = z.object({
	actionId: z.number().int().positive().describe("Action ID"),
	name: z.string().optional().describe("Action name"),
	description: z.string().optional().describe("Action description"),
	post_to_slack: z.boolean().optional().describe("Whether to post to Slack"),
	slack_message_format: z.string().optional().describe("Slack message format"),
	steps: z.array(z.record(z.any())).optional().describe("Action steps/triggers"),
	deleted: z.boolean().optional().describe("Whether action is deleted"),
	is_calculating: z.boolean().optional().describe("Whether action is calculating"),
});

export const DeleteActionSchema = z.object({
	actionId: z.number().int().positive().describe("Action ID"),
}); 