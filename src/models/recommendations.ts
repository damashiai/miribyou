import { AnimeMeta } from "./anime";

export interface Recommendation {
  entry: AnimeMeta;
  url: string;
  votes: number;
}
