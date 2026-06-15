import { load } from "cheerio";

export function parseMoreInfo(html: string): string | null {
  const $ = load(html);
  const rightside = $(".rightside");

  // In moreinfo page, it's usually just the text in rightside after cleaning up some meta
  // But Jikan PHP uses removeChildNodes which is a bit more aggressive.
  // Usually MAL moreinfo page has a h2 "More Info" and then the content.

  let text = rightside.text().trim();

  // If it's the moreinfo page, it might have "No more information has been added to this title."
  if (text.includes("No more information has been added to this title.")) {
    return null;
  }

  return text || null;
}
