import * as v from "valibot";
import { system } from "@silverbulletmd/silverbullet/syscalls";

const settingsSchema = v.strictObject({
  createInSubfolder: v.optional(
    v.boolean("Expected boolean for createInSubfolder option"),
    false,
  ),
}, "Unknown entry in settings expected nothing");

export async function getSettings(): Promise<
  v.InferOutput<typeof settingsSchema>
> {
  const settings = await system.getSpaceConfig("excalidraw");

  const result = v.parse(
    settingsSchema,
    settings ?? {},
  );

  return result;
}
