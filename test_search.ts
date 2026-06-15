import { parseAnimeSearch } from "./src/parsers/anime_search";
import { parseMangaSearch } from "./src/parsers/manga_search";
import { parseUserSearch } from "./src/parsers/user_search";

async function testSearch() {
  console.log('--- Testing Anime Search: "One Piece" ---');
  const animeRes = await fetch(
    "https://myanimelist.net/anime.php?q=One%20Piece",
  );
  const animeHtml = await animeRes.text();
  const animeData = parseAnimeSearch(animeHtml);
  console.log(
    "Anime Pagination:",
    JSON.stringify(animeData.pagination, null, 2),
  );
  console.log(
    "Anime First Result:",
    JSON.stringify(animeData.data[0], null, 2),
  );

  console.log('\n--- Testing Manga Search: "Naruto" ---');
  const mangaRes = await fetch("https://myanimelist.net/manga.php?q=Naruto");
  const mangaHtml = await mangaRes.text();
  const mangaData = parseMangaSearch(mangaHtml);
  console.log(
    "Manga Pagination:",
    JSON.stringify(mangaData.pagination, null, 2),
  );
  console.log(
    "Manga First Result:",
    JSON.stringify(mangaData.data[0], null, 2),
  );

  console.log('\n--- Testing User Search: "nattadasu" ---');
  const userRes = await fetch("https://myanimelist.net/users.php?q=nattadasu");
  const userHtml = await userRes.text();
  const userData = parseUserSearch(userHtml);
  console.log("User Pagination:", JSON.stringify(userData.pagination, null, 2));
  console.log("User First Result:", JSON.stringify(userData.data[0], null, 2));

  console.log('\n--- Testing User Search: "Karasian" ---');
  const userRes2 = await fetch("https://myanimelist.net/users.php?q=Karasian");
  const userHtml2 = await userRes2.text();
  const userData2 = parseUserSearch(userHtml2);
  console.log("User First Result:", JSON.stringify(userData2.data[0], null, 2));
}

testSearch().catch(console.error);
