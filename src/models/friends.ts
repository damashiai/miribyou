import { UserMeta } from "./user";

export interface Friend {
  user: UserMeta;
  last_online: string;
  friends_since: string | null;
}
