import { describe, it, expect, vi } from "vitest";
import worker from "../src/index";
import { SELF } from "cloudflare:test";

describe("Official MAL API Integration", () => {
  it("uses official API for anime search if X-MAL-CLIENT-ID is provided", async () => {
    const mockResponse = {
      data: [
        {
          node: {
            id: 5114,
            title: "Fullmetal Alchemist: Brotherhood",
            main_picture: {
              medium: "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
              large: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg",
            },
            alternative_titles: {
              en: "Fullmetal Alchemist: Brotherhood",
              ja: "鋼の錬金術師 FULLMETAL ALCHEMIST",
              synonyms: ["FMA", "FMAB"],
            },
            media_type: "tv",
            status: "finished_airing",
            num_episodes: 64,
            mean: 9.1,
            genres: [{ id: 1, name: "Action" }],
          },
        },
      ],
      paging: {},
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation((url: string, init?: any) => {
      if (url.includes("api.myanimelist.net/v2/anime")) {
        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), { status: 200 }),
        );
      }
      return originalFetch(url, init);
    });

    try {
      const response = await SELF.fetch(
        "https://example.com/v4/anime?q=fullmetal",
        {
          headers: {
            "x-mal-client-id": "mock_client_id",
          },
        },
      );
      const body = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(body.data.length).toBe(1);
      expect(body.data[0].mal_id).toBe(5114);
      expect(body.data[0].title).toBe("Fullmetal Alchemist: Brotherhood");
      expect(body.data[0].title_english).toBe(
        "Fullmetal Alchemist: Brotherhood",
      );
      expect(body.data[0].type).toBe("TV");
      expect(body.data[0].episodes).toBe(64);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("uses official API for manga search if X-MAL-CLIENT-ID is provided", async () => {
    const mockResponse = {
      data: [
        {
          node: {
            id: 2,
            title: "Berserk",
            main_picture: {
              medium: "https://cdn.myanimelist.net/images/manga/1/157814.jpg",
              large: "https://cdn.myanimelist.net/images/manga/1/157814l.jpg",
            },
            alternative_titles: {
              en: "Berserk",
              ja: "ベルセルク",
            },
            media_type: "manga",
            status: "currently_publishing",
            num_chapters: 380,
            mean: 9.47,
          },
        },
      ],
      paging: {},
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation((url: string, init?: any) => {
      if (url.includes("api.myanimelist.net/v2/manga")) {
        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), { status: 200 }),
        );
      }
      return originalFetch(url, init);
    });

    try {
      const response = await SELF.fetch(
        "https://example.com/v4/manga?q=berserk",
        {
          headers: {
            "x-mal-client-id": "mock_client_id",
          },
        },
      );
      const body = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(body.data.length).toBe(1);
      expect(body.data[0].mal_id).toBe(2);
      expect(body.data[0].title).toBe("Berserk");
      expect(body.data[0].type).toBe("Manga");
      expect(body.data[0].status).toBe("Publishing");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("uses official API for anime search if MAL_CLIENT_ID is provided in environment", async () => {
    const mockResponse = {
      data: [
        {
          node: {
            id: 5114,
            title: "Fullmetal Alchemist: Brotherhood",
            main_picture: {
              medium: "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
            },
            alternative_titles: {
              en: "Fullmetal Alchemist: Brotherhood",
            },
            media_type: "tv",
            status: "finished_airing",
          },
        },
      ],
      paging: {},
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation((url: string, init?: any) => {
      if (url.includes("api.myanimelist.net/v2/anime")) {
        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), { status: 200 }),
        );
      }
      return originalFetch(url, init);
    });

    try {
      const { createExecutionContext, waitOnExecutionContext } =
        await import("cloudflare:test");
      const request = new Request("http://example.com/v4/anime?q=fullmetal");
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { MAL_CLIENT_ID: "mock_client_id" },
        ctx,
      );
      await waitOnExecutionContext(ctx);
      const body = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(body.data.length).toBe(1);
      expect(body.data[0].mal_id).toBe(5114);
      expect(body.data[0].title).toBe("Fullmetal Alchemist: Brotherhood");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
