import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type SavedJob = Database["public"]["Tables"]["saved_jobs"]["Row"];

/** getEmployerContext のヘルパー戻り値用 */
export type CompanySummary = Pick<Company, "id" | "name">;
