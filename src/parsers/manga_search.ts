import { load } from "cheerio";
import { MAL_BASE_URL } from "../constants";
import { parseMalDate, cleanImageUrl } from "../utils";

export function parseMangaSearch(html: string): any {
  const $ = load(html);
  const results: any[] = [];

  $(".js-categories-seasonal table tr:not(:first-child)").each((_, row) => {
    const $row = $(row);
    const titleLink = $row.find("td:nth-child(2) a.hoverinfo_trigger");
    const title = titleLink.text().trim();
    const url = titleLink.attr("href") || "";
    const mal_id = parseInt(url.split("/").slice(-2, -1)[0] || "0");

    let imageUrl = cleanImageUrl(
      $row.find("td:nth-child(1) img").attr("data-src") ||
        $row.find("td:nth-child(1) img").attr("src"),
    );
    imageUrl = imageUrl.replace(/\/r\/\d+x\d+/, "");

    const type = $row.find("td:nth-child(3)").text().trim();

    const volumes =
      parseInt($row.find("td:nth-child(4)").text().trim() || "0") || null;
    const score =
      parseFloat($row.find("td:nth-child(5)").text().trim() || "0") || null;

    const startDate = $row.find("td:nth-child(6)").text().trim();
    const endDate = $row.find("td:nth-child(7)").text().trim();
    const members =
      parseInt(
        $row.find("td:nth-child(8)").text().trim().replace(/,/g, "") || "0",
      ) || null;
    const chapters =
      parseInt($row.find("td:nth-child(9)").text().trim() || "0") || null;

    const published = parseMalDate(`${startDate} to ${endDate}`);

    if (title) {
      results.push({
        mal_id,
        url,
        images: {
          jpg: {
            image_url: imageUrl,
            small_image_url: imageUrl.replace(".jpg", "t.jpg"),
            large_image_url: imageUrl.replace(".jpg", "l.jpg"),
          },
          webp: {
            image_url: imageUrl.replace(".jpg", ".webp"),
            small_image_url: imageUrl.replace(".jpg", "t.webp"),
            large_image_url: imageUrl.replace(".jpg", "l.webp"),
          },
        },
        title,
        type,
        volumes,
        chapters,
        score,
        scored: score,
        published,
        members,
      });
    }
  });

  // Pagination
  const paginationDiv = $(".pagination, .bgColor1");
  const lastPageLink = paginationDiv.find("a").last().attr("href");
  let last_visible_page = 1;
  if (lastPageLink) {
    const match = lastPageLink.match(/show=(\d+)/);
    if (match) {
      last_visible_page = Math.floor(parseInt(match[1]) / 50) + 1;
    } else {
      const pageNum = parseInt(paginationDiv.find("a").last().text());
      if (!isNaN(pageNum)) last_visible_page = pageNum;
    }
  }

  const text = paginationDiv.text();
  const hasNext = paginationDiv
    .find("a")
    .map((_, el) => {
      const page = parseInt($(el).text());
      const current = parseInt(text.match(/\[(\d+)\]/)?.[1] || "1");
      return page > current;
    })
    .get()
    .some((v) => v);

  return {
    pagination: {
      last_visible_page,
      has_next_page: hasNext,
      current_page: 1,
      items: {
        count: results.length,
        total: last_visible_page * 50,
        per_page: 50,
      },
    },
    data: results,
  };
}
