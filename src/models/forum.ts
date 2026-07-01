export interface ForumTopic {
  mal_id: number;
  url: string;
  title: string;
  date: string | null;
  author_username: string;
  author_url: string;
  comments: number;
  last_comment: {
    url: string;
    author_username: string;
    author_url: string;
    date: string | null;
  };
}
