import { ImageResource } from "./anime.js";

export interface UserMeta {
  username: string;
  url: string;
  images: ImageResource;
}

export interface User {
  mal_id: number | null;
  username: string;
  url: string;
  images: ImageResource;
  last_online: string | null;
  gender: string | null;
  birthday: string | null;
  location: string | null;
  joined: string | null;
  statistics?: {
    anime: {
      days_watched: number;
      mean_score: number;
      watching: number;
      completed: number;
      on_hold: number;
      dropped: number;
      plan_to_watch: number;
      total_entries: number;
      rewatched: number;
      episodes_watched: number;
    };
    manga: {
      days_read: number;
      mean_score: number;
      reading: number;
      completed: number;
      on_hold: number;
      dropped: number;
      plan_to_read: number;
      total_entries: number;
      reread: number;
      chapters_read: number;
      volumes_read: number;
    };
  };
  favorites?: {
    anime: any[];
    manga: any[];
    characters: any[];
    people: any[];
  };
  about?: string | null;
  updates?: {
    anime: any[];
    manga: any[];
  };
  external?: { name: string; url: string }[];
}
