export type Role = "commander" | "analyst" | "agent" | "observer" | "user";

export const permissions = {
    canEscalate: (role: string | undefined) => role === "commander" || role === "admin" || role === "user",
    canViewAI: (role: string | undefined) => role === "analyst" || role === "commander" || role === "admin" || role === "user",
    canSendMessage: (role: string | undefined) => role !== "observer",
    isSimpleView: (role: string | undefined) => role === "agent"
};
