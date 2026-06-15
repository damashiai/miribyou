import { UserMeta } from "./user";

export interface UserUpdate {
  user: UserMeta;
  score: number | null;
  status: string;
  episodes_seen?: number | null;
  episodes_total?: number | null;
  chapters_read?: number | null;
  chapters_total?: number | null;
  volumes_read?: number | null;
  volumes_total?: number | null;
  date: string;
}
