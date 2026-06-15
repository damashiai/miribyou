import { load } from "cheerio";
import { History } from "../models/history";
import { MAL_BASE_URL } from "../constants";
import { toIsoDate, ensureMalUrl } from "../utils";

export function parseHistory(html: string): History[] {
  const $ = load(html);
  const history: History[] = [];

  $("#content table tr:not(:first-child)").each((_, element) => {
    const $element = $(element);
    const link = $element.find("td:nth-child(1) a");
    const title = link.text().trim();
    const url = ensureMalUrl(link.attr("href"));

    const parts = (link.attr("href") || "").split("/").filter(Boolean);
    const mal_id = parseInt(parts[1] || "0");
    const type = parts[0] === "anime" ? "anime" : "manga";

    const dateText = $element.find("td:nth-child(2)").text().trim();
    const date = toIsoDate(dateText);

    if (title) {
      history.push({
        entry: {
          mal_id,
          url,
          type,
          title,
        },
        increment: 1, // History usually doesn't show increment directly on this page
        date: date || dateText,
      });
    }
  });

  return history;
}
