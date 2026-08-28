import { EventEmitter } from "@/shared/events";

export type AuthEvents = {
  "auth:authenticated": void;
  "auth:logged-out": void;
  "auth:session-expired": { reason: string };
};

export const authEvents = new EventEmitter<AuthEvents>();
