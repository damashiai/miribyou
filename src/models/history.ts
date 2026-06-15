import { MalUrl } from "../models/anime";

export interface HistoryItem {
  entry: MalUrl;
  increment: number;
  date: string;
}
