import { AnimeMeta } from "./anime.js";

export interface Recommendation {
  entry: AnimeMeta;
  url: string;
  votes: number;
}
