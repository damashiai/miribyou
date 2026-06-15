import { AnimeMeta } from "./anime";

export interface Promo {
  title: string;
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images: {
      image_url: string | null;
      small_image_url?: string | null;
      medium_image_url?: string | null;
      large_image_url?: string | null;
      maximum_image_url?: string | null;
    };
  };
}

export interface VideoEpisode {
  mal_id: number;
  url: string;
  title: string;
  episode: string;
  images: {
    jpg: { image_url: string | null };
    webp?: { image_url: string | null };
  };
}

export interface MusicVideo {
  title: string;
  video: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images: {
      image_url: string | null;
      small_image_url?: string | null;
      medium_image_url?: string | null;
      large_image_url?: string | null;
      maximum_image_url?: string | null;
    };
  };
  meta: {
    title: string | null;
    author: string | null;
  };
}

export interface AnimeVideos {
  promo: Promo[];
  episodes: VideoEpisode[];
  music_videos: MusicVideo[];
}
