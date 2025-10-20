import { z } from "zod";

/**
 * Type definitions for trace data
 *
 * INTENTIONAL ISSUES (for candidates to fix in Tier 1):
 * 1. Schema expects `tool` as an object only, but the API sometimes sends a string
 * 2. Schema expects Date types, but the API sends ISO date strings
 */

// Tool schema - expects object format only (but API sends string OR object)
const ToolSchema = z.object({
  name: z.string(),
});

// Error schema
const ErrorSchema = z.object({
  message: z.string(),
  type: z.string().optional(),
});

// Step schema - expects Date types (but API sends ISO strings)
export const StepSchema = z.object({
  id: z.string(),
  step: z.string(),
  start_time: z.date(), // MISMATCH: API sends ISO string, not Date
  end_time: z.date(),   // MISMATCH: API sends ISO string, not Date
  tool: ToolSchema,     // MISMATCH: API sometimes sends string instead of object
  input: z.string().optional(),
  output: z.string().optional(),
  error: ErrorSchema.optional(),
});

export const TraceResponseSchema = z.object({
  steps: z.array(StepSchema),
});

export type Step = z.infer<typeof StepSchema>;
export type TraceResponse = z.infer<typeof TraceResponseSchema>;
