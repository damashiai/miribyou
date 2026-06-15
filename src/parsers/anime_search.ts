import { load } from "cheerio";
import { MAL_BASE_URL } from "../constants";
import { parseMalDate, cleanImageUrl } from "../utils";

export function parseAnimeSearch(html: string): any {
  const $ = load(html);

  const results = $(".js-categories-seasonal table tr")
    .slice(1)
    .map((_, tr) => {
      const $tr = $(tr);
      const titleLink = $tr.find("td:nth-child(2) a.hoverinfo_trigger").first();
      const href = titleLink.attr("href") || "";
      const title = titleLink.text().trim();

      let imageUrl = cleanImageUrl(
        $tr.find("td:nth-child(1) img").attr("data-src") ||
          $tr.find("td:nth-child(1) img").attr("src"),
      );
      imageUrl = imageUrl.replace(/\/r\/\d+x\d+/, "");

      const synopsis = $tr
        .find("td:nth-child(2) .pt4")
        .clone()
        .find("a")
        .remove()
        .end()
        .text()
        .trim();

      const type = $tr.find("td:nth-child(3)").text().trim();
      const episodes =
        parseInt($tr.find("td:nth-child(4)").text().trim() || "0") || null;
      const score =
        parseFloat($tr.find("td:nth-child(5)").text().trim() || "0") || null;

      const startDate = $tr.find("td:nth-child(6)").text().trim();
      const endDate = $tr.find("td:nth-child(7)").text().trim();
      const members =
        parseInt(
          $tr.find("td:nth-child(8)").text().trim().replace(/,/g, "") || "0",
        ) || null;
      const rating = $tr.find("td:nth-child(9)").text().trim() || null;

      const aired = parseMalDate(`${startDate} to ${endDate}`);

      return {
        mal_id: parseInt(href.split("/").slice(-2, -1)[0] || "0"),
        url: href,
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
        synopsis,
        type,
        episodes,
        score,
        aired,
        members,
        rating,
      };
    })
    .get();

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
  // If we find a link that contains text "Next" or if there's a link after the current page number
  const hasNextPage =
    paginationDiv.find('a:contains("Next"), a:contains(">")').length > 0 ||
    paginationDiv.text().match(/\[\d+\]\s*<a/) !== null ||
    (paginationDiv.find("span.bgColor1").length > 0 &&
      paginationDiv.find("span.bgColor1").nextAll("a").length > 0) ||
    (paginationDiv.text().includes("[") &&
      paginationDiv.text().split("[")[1].includes("]") &&
      paginationDiv.text().split("]")[1].includes("href"));

  // Real check for MAL's specific search pagination
  const text = paginationDiv.text();
  const nextMatch = text.match(/\[(\d+)\]\s*<a/); // This won't work on text() because it strips tags

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
        total: last_visible_page * 50, // Best guess
        per_page: 50,
      },
    },
    data: results,
  };
}
