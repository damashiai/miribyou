import { load } from "cheerio";
import { NewsListItem } from "../models/news";
import { MAL_BASE_URL } from "../constants";
import { toIsoDate, cleanImageUrl } from "../utils";

export function parseNews(html: string): NewsListItem[] {
  const $ = load(html);
  const news: NewsListItem[] = [];

  $(".news-list .news-unit").each((_, element) => {
    const $element = $(element);
    const titleLink = $element.find("p a strong").parent();
    const title = titleLink.text().trim();
    const url = MAL_BASE_URL + titleLink.attr("href");
    const mal_id = parseInt(url.split("/").pop() || "0");

    const imageUrl = cleanImageUrl(
      $element.find("img").attr("data-src") || $element.find("img").attr("src"),
    );

    const infoRow = $element.find("p").last().text().trim();
    const datePart = infoRow.split(" by")[0];
    const date = toIsoDate(datePart);

    const authorLink = $element.find('a[href*="/profile/"]').first();
    const author_username = authorLink.text().trim();
    const author_url = MAL_BASE_URL + authorLink.attr("href");

    const forumLink = $element.find("a").last();
    const forum_url = MAL_BASE_URL + forumLink.attr("href");
    const commentsText = forumLink.text();
    const commentsMatch = commentsText.match(/Discuss \((\d+) comments\)/);
    const comments = commentsMatch ? parseInt(commentsMatch[1]) : 0;

    const excerpt = $element.find("p").eq(1).text().trim();

    news.push({
      mal_id,
      url,
      title,
      date: date || datePart,
      author_username,
      author_url,
      forum_url,
      images: {
        jpg: { image_url: imageUrl || "" },
        webp: {
          image_url: imageUrl ? imageUrl.replace(".jpg", ".webp") : "",
        },
      },
      comments,
      excerpt,
    });
  });

  return news;
}
