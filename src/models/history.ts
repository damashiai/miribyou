import { MalUrl } from "../models/anime.js";

export interface History {
  entry: MalUrl;
  increment: number;
  date: string;
}
