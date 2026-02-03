import { z } from "zod";

export const LangSchema = z.enum(["fr", "en"]);

export const ControlRefSchema = z.object({
  framework: z.string().min(1),
  id: z.string().min(1)
});

export const TagsSchema = z
  .object({
    domains: z.array(z.string()).default([]), // e.g., ["D01","D02"]
    cia: z.array(z.enum(["C", "I", "A"])).default([]),
    type: z.array(z.enum(["prevent", "detect", "correct", "recover"])).default([])
  })
  .default({ domains: [], cia: [], type: [] });

// Generic control record (keeps us license-safe: short titles only, no verbatim long text).
export const ControlSchema = z.object({
  id: z.string().min(1),
  framework: z.string().min(1),
  title: z.string().min(1),
  domain: z.string().optional(),
  notes: z.string().optional(),
  tags: TagsSchema.optional(),
  sources: z.array(z.string()).default([])
});

export const ControlCatalogSchema = z.object({
  id: z.string().min(1),
  framework: z.string().min(1),
  version: z.string().min(1),
  controls: z.array(ControlSchema)
});

export const MappingItemSchema = z.object({
  from: ControlRefSchema,
  to: z.array(ControlRefSchema).min(1),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
  rationale: z.string().optional()
});

export const MappingSchema = z.object({
  id: z.string().min(1),
  fromFramework: z.string().min(1),
  toFramework: z.string().min(1),
  items: z.array(MappingItemSchema)
});

export type ControlCatalog = z.infer<typeof ControlCatalogSchema>;
export type Mapping = z.infer<typeof MappingSchema>;
