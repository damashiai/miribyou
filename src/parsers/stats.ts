import { load } from "cheerio";

export interface ScoreStats {
  score: number;
  votes: number;
  percentage: number;
}

export interface Statistics {
  watching?: number;
  reading?: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_watch?: number;
  plan_to_read?: number;
  total: number;
  scores: ScoreStats[];
}

export function parseStatistics(
  html: string,
  type: "anime" | "manga",
): Statistics {
  const $ = load(html);

  const sanitize = (text: string) =>
    parseInt(text.replace(/[^0-9]/g, "") || "0");

  const watchingReadingLabel = type === "anime" ? "Watching:" : "Reading:";
  const planToLabel = type === "anime" ? "Plan to Watch:" : "Plan to Read:";

  const getVal = (label: string) => {
    const span = $(`.spaceit_pad span:contains("${label}")`);
    return sanitize(span.parent().text());
  };

  const stats: any = {
    completed: getVal("Completed:"),
    on_hold: getVal("On-Hold:"),
    dropped: getVal("Dropped:"),
    total: getVal("Total:"),
  };

  if (type === "anime") {
    stats.watching = getVal("Watching:");
    stats.plan_to_watch = getVal("Plan to Watch:");
  } else {
    stats.reading = getVal("Reading:");
    stats.plan_to_read = getVal("Plan to Read:");
  }

  const scores: ScoreStats[] = [];
  $('h2:contains("Score Stats")')
    .nextAll("table")
    .first()
    .find("tr")
    .each((_, element) => {
      const $element = $(element);
      const score = parseInt(
        $element.find("td:nth-child(1)").text().trim() || "0",
      );
      const smallText = $element.find("td:nth-child(2) small").text();
      const votes = sanitize(smallText);

      const percentageText = $element
        .find("td:nth-child(2) div span")
        .contents()
        .filter(function () {
          return this.nodeType === 3;
        })
        .text()
        .replace("%", "")
        .trim();
      const percentage = parseFloat(percentageText || "0");

      if (score > 0) {
        scores.push({ score, votes, percentage });
      }
    });

  // Fill missing scores
  for (let i = 1; i <= 10; i++) {
    if (!scores.find((s) => s.score === i)) {
      scores.push({ score: i, votes: 0, percentage: 0 });
    }
  }
  scores.sort((a, b) => a.score - b.score);

  stats.scores = scores;

  return stats as Statistics;
}
