import { load } from "cheerio";
import { UserMeta } from "../models/user";
import { MAL_BASE_URL } from "../constants";
import { toIsoDate, cleanImageUrl } from "../utils";

export function parseUserSearch(html: string): any {
  const $ = load(html);

  // Check if we are on a profile page (redirected)
  if ($(".user-profile").length > 0) {
    const titleText = $("title").text();
    const username =
      titleText.split("'s Profile")[0].trim() ||
      $(".header-profile-name").text().trim();
    const profile_image = cleanImageUrl(
      $(".user-profile .user-image img").attr("data-src") ||
        $(".user-profile .user-image img").attr("src"),
    );

    return {
      pagination: {
        last_visible_page: 1,
        has_next_page: false,
      },
      data: [
        {
          username,
          url: MAL_BASE_URL + `/profile/${username}`,
          images: {
            jpg: {
              image_url: profile_image
                .replace("thumbs/", "")
                .replace("_thumb", ""),
            },
            webp: {
              image_url: profile_image
                .replace("thumbs/", "")
                .replace("_thumb", "")
                .replace(".jpg", ".webp"),
            },
          },
        },
      ],
    };
  }

  const results: any[] = [];

  // Search results are often in divs with profile links
  $('a[href*="/profile/"]').each((_, element) => {
    const $el = $(element);
    const url = $el.attr("href") || "";

    // Match /profile/username (no sub-paths)
    const match = url.match(/\/profile\/([^\/\?#]+)$/);
    if (!match) return;

    const username = match[1];
    if (!username || username === "Profile") return;

    // Avoid duplicates
    if (results.find((r) => r.username === username)) return;

    // Try to find the image link that points to the same profile
    let imageUrl = "";
    const imgEl = $(`a[href*="/profile/${username}"] img`);
    imgEl.each((_, i) => {
      const src = cleanImageUrl($(i).attr("data-src") || $(i).attr("src"));
      if (src && !src.includes("spacer.gif")) {
        imageUrl = src;
        return false;
      }
    });

    results.push({
      username,
      url: url.startsWith("http") ? url : MAL_BASE_URL + url,
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
    });
  });

  const paginationDiv = $(".pagination, .bgColor1");
  const hasNextPage =
    paginationDiv.find('a:contains("Next"), a:contains(">"), span.bgColor1 + a')
      .length > 0;

  return {
    pagination: {
      last_visible_page: parseInt(paginationDiv.find("a").last().text()) || 1,
      has_next_page: hasNextPage,
    },
    data: results,
  };
}
