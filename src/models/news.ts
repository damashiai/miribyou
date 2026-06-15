import { ImageResource } from "./anime";

export interface NewsListItem {
  mal_id: number | null;
  url: string;
  title: string;
  date: string | null;
  author_username: string;
  author_url: string;
  forum_url: string;
  images: ImageResource;
  comments: number;
  excerpt: string;
}
