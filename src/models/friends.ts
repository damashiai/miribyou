import { UserMeta } from "./user.js";

export interface Friend {
  user: UserMeta;
  last_online: string;
  friends_since: string | null;
}
