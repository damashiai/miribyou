import { ImageResource, MalUrl, Title, DateRange, Relation } from "./anime.js";

export interface MangaMeta {
  mal_id: number;
  url: string;
  images: ImageResource;
  title: string;
}

export interface Manga {
  mal_id: number;
  url: string;
  images: ImageResource;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  chapters: number | null;
  volumes: number | null;
  status: string | null;
  publishing: boolean;
  published: DateRange;
  score: number | null;
  scored: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  authors: MalUrl[];
  serializations: MalUrl[];
  genres: MalUrl[];
  explicit_genres: MalUrl[];
  themes: MalUrl[];
  demographics: MalUrl[];
  relations?: Relation[];
  external?: { name: string; url: string }[];
}
