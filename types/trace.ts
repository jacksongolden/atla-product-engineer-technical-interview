import { z } from "zod";

/**
 * Type definitions for trace data
 */

const ToolSchema = z.object({
  name: z.string(),
});

const ErrorSchema = z.object({
  message: z.string(),
  type: z.string().optional(),
});

export const StepSchema = z.object({
  id: z.string(),
  step: z.string(),
  start_time: z.string().transform((str) => new Date(str)),
  end_time: z.string().transform((str) => new Date(str)),
  tool: ToolSchema,
  input: z.string().optional(),
  output: z.string().optional(),
  error: ErrorSchema.optional(),
});

export const TraceResponseSchema = z.object({
  steps: z.array(StepSchema),
});

export type Step = z.infer<typeof StepSchema>;
export type TraceResponse = z.infer<typeof TraceResponseSchema>;
