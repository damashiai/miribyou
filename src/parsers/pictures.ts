import { load } from "cheerio";
import { MAL_BASE_URL } from "../constants.js";
import { cleanImageUrl } from "../utils.js";

export function parsePictures(html: string): any[] {
  const $ = load(html);
  const pictures: any[] = [];

  $(".picSurround a").each((_, element) => {
    const imageUrl = cleanImageUrl($(element).attr("href"));
    if (imageUrl) {
      pictures.push({
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
      });
    }
  });

  return pictures;
}
