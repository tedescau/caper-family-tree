import { z } from "zod";

export const PersonSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  tags: z.array(z.string()),
  active_since: z.number().optional(),
});

export const RestaurantSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  opened: z.number(),
  closed: z.number().optional(),
  status: z.enum(["active", "closed"]),
  group: z.string(),
});

export const GroupSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  type: z.string(),
  founded: z.number(),
  description: z.string(),
});

export const RelationshipSchema = z.object({
  source: z.string().regex(/^[a-z0-9-]+$/),
  target: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum([
    "alumni",
    "founded",
    "current_staff",
    "opened_new",
    "belongs_to",
    "family",
    "same_space",
  ]),
  label: z.string(),
});

export const FamilyDataSchema = z.object({
  people: z.array(PersonSchema),
  restaurants: z.array(RestaurantSchema),
  groups: z.array(GroupSchema),
  relationships: z.array(RelationshipSchema),
});

export type Person = z.infer<typeof PersonSchema>;
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export type FamilyData = z.infer<typeof FamilyDataSchema>;
