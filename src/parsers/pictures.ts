import { load } from "cheerio";
import { MAL_BASE_URL } from "../constants";
import { cleanImageUrl } from "../utils";

export function parsePictures(html: string): any[] {
  const $ = load(html);
  const pictures: any[] = [];

  $(".picSurround a").each((_, element) => {
    const imageUrl = cleanImageUrl($(element).attr("href"));
    if (imageUrl) {
      pictures.push({
        jpg: { image_url: imageUrl },
        webp: { image_url: imageUrl.replace(".jpg", ".webp") },
      });
    }
  });

  return pictures;
}
