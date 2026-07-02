import { load } from "cheerio";
import { Friend } from "../models/friends.js";
import { MAL_BASE_URL } from "../constants.js";
import { cleanImageUrl, toIsoDate } from "../utils.js";

export function parseFriends(html: string): Friend[] {
  const $ = load(html);
  const friends: Friend[] = [];

  $(".boxlist-container .boxlist").each((_, element) => {
    const $element = $(element);
    const nameLink = $element.find("div:nth-child(3) div a");
    const username = nameLink.text().trim();
    const url = nameLink.attr("href") || "";
    const imageUrl = cleanImageUrl(
      $element.find("div:nth-child(1) a img").attr("data-src") ||
        $element.find("div:nth-child(1) a img").attr("src"),
    );

    const dataDiv = $element.find(".data");
    const last_online = toIsoDate(
      dataDiv.find("div:nth-child(2)").text().trim(),
    );
    let friends_since: string | null = null;
    const friendsSinceText = dataDiv.find("div:nth-child(3)").text().trim();
    if (friendsSinceText.startsWith("Friends since ")) {
      friends_since = toIsoDate(friendsSinceText.replace("Friends since ", ""));
    }

    friends.push({
      user: {
        username,
        url,
        images: {
          jpg: {
            image_url: imageUrl.replace("thumbs/", "").replace("_thumb", ""),
          },
          webp: {
            image_url: imageUrl
              .replace("thumbs/", "")
              .replace("_thumb", "")
              .replace(".jpg", ".webp"),
          },
        },
      },
      last_online: last_online || "",
      friends_since,
    });
  });

  return friends;
}
