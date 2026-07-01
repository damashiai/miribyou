import { load } from "cheerio";
import { AnimeVideos, Promo, VideoEpisode, MusicVideo } from "../models/videos";
import { MAL_BASE_URL } from "../constants";
import { cleanImageUrl, ensureMalUrl, extractMalId } from "../utils";

export function parseAnimeVideos(html: string): AnimeVideos {
  const $ = load(html);

  const promos: Promo[] = [];
  $(".video-block.promotional-video section div").each((_, element) => {
    const $element = $(element);
    const title = $element.find("span.title").text().trim();
    const trailerUrl = $element.find("a.js-video-item").attr("href") || null;
    const youtubeId = trailerUrl
      ? trailerUrl.split("/").pop()?.split("?")[0] || null
      : null;
    const imageUrl = cleanImageUrl(
      $element.find("img").attr("data-src") || $element.find("img").attr("src"),
    );

    promos.push({
      title,
      trailer: {
        youtube_id: youtubeId,
        url: trailerUrl,
        embed_url: youtubeId
          ? `https://www.youtube.com/embed/${youtubeId}`
          : null,
        images: {
          image_url: imageUrl,
          medium_image_url: imageUrl,
          large_image_url: imageUrl,
        },
      },
    });
  });

  const episodes: VideoEpisode[] = [];
  $("a.video-list").each((_, a) => {
    const $a = $(a);
    const href = $a.attr("href") || "";
    if (!href.includes("/episode/")) return;
    const url = ensureMalUrl(href);
    const mal_id = extractMalId(url);
    const episodeNum = $a
      .find("span.title")
      .contents()
      .filter((_, el) => el.nodeType === 3)
      .text()
      .trim();
    const episodeTitle = $a.find("span.episode-title").text().trim();
    const imageUrl = cleanImageUrl(
      $a.find("img").attr("data-src") || $a.find("img").attr("src") || "",
    );

    episodes.push({
      mal_id,
      url,
      title: episodeTitle,
      episode: episodeNum,
      images: {
        jpg: { image_url: imageUrl },
      },
    });
  });

  const music_videos: MusicVideo[] = [];
  $(".video-block.music-video section div").each((_, element) => {
    const $element = $(element);
    const title = $element.find("span.title").text().trim();
    const videoUrl = $element.find("a.js-video-item").attr("href") || null;
    const youtubeId = videoUrl
      ? videoUrl.split("/").pop()?.split("?")[0] || null
      : null;
    const imageUrl = cleanImageUrl(
      $element.find("img").attr("data-src") || $element.find("img").attr("src"),
    );

    const author = $element.find(".meta .author").text().trim() || null;
    const metaTitle = $element.find(".meta .title").text().trim() || null;

    music_videos.push({
      title,
      video: {
        youtube_id: youtubeId,
        url: videoUrl,
        embed_url: youtubeId
          ? `https://www.youtube.com/embed/${youtubeId}`
          : null,
        images: {
          image_url: imageUrl,
          medium_image_url: imageUrl,
          large_image_url: imageUrl,
        },
      },
      meta: {
        title: metaTitle,
        author,
      },
    });
  });

  return {
    promo: promos,
    episodes,
    music_videos,
  };
}
