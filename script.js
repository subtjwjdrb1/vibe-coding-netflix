const API_KEY = "a465f1d60e7bf90b19258a78e993de8a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function fetchNowPlaying() {
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const movieListEl = document.getElementById("movie-list");

  loadingEl.hidden = false;
  errorEl.hidden = true;

  try {
    const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=KR`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("API 요청 실패");
    }

    const data = await res.json();
    const movies = data.results || [];

    movieListEl.innerHTML = "";

    if (!movies.length) {
      loadingEl.textContent = "표시할 영화가 없습니다.";
      return;
    }

    movies.forEach((movie) => {
      const card = createMovieCard(movie);
      movieListEl.appendChild(card);
    });

    loadingEl.hidden = true;
  } catch (err) {
    console.error(err);
    loadingEl.hidden = true;
    errorEl.hidden = false;
  }
}

function createMovieCard(movie) {
  const {
    title,
    original_title,
    poster_path,
    overview,
    vote_average,
    release_date,
  } = movie;

  const card = document.createElement("article");
  card.className = "movie-card";

  const posterWrapper = document.createElement("div");
  posterWrapper.className = "movie-poster-wrapper";

  if (poster_path) {
    const img = document.createElement("img");
    img.className = "movie-poster";
    img.src = `${IMAGE_BASE_URL}${poster_path}`;
    img.alt = title || original_title || "영화 포스터";
    posterWrapper.appendChild(img);
  } else {
    // 포스터가 없는 경우 대체 배경
    posterWrapper.style.display = "flex";
    posterWrapper.style.alignItems = "center";
    posterWrapper.style.justifyContent = "center";
    posterWrapper.style.background =
      "linear-gradient(135deg, #333 0%, #111 100%)";

    const placeholder = document.createElement("div");
    placeholder.style.fontSize = "0.8rem";
    placeholder.style.textAlign = "center";
    placeholder.style.padding = "0.5rem";
    placeholder.style.color = "#ccc";
    placeholder.textContent = "포스터 없음";

    posterWrapper.appendChild(placeholder);
  }

  const info = document.createElement("div");
  info.className = "movie-info";

  const titleEl = document.createElement("h3");
  titleEl.className = "movie-title";
  titleEl.textContent = title || original_title || "제목 미상";

  const overviewEl = document.createElement("p");
  overviewEl.className = "movie-overview";
  const overviewText =
    overview && overview.trim().length > 0
      ? overview.trim()
      : "줄거리 정보가 없습니다.";
  overviewEl.textContent = overviewText;
  // 브라우저 기본 툴팁 + 커스텀 툴팁에서 사용할 전체 줄거리 텍스트를 카드 data 속성에 저장
  card.dataset.overview = overviewText;
  // 카드 어디에 마우스를 올려도 기본 툴팁이 뜨도록
  card.title = overviewText;

  const meta = document.createElement("div");
  meta.className = "movie-meta";

  const vote = document.createElement("div");
  vote.className = "vote";
  vote.innerHTML = `<span>★</span>${vote_average?.toFixed(1) || "N/A"}`;

  const year = document.createElement("span");
  year.textContent = release_date ? release_date.slice(0, 4) : "개봉일 정보 없음";

  meta.appendChild(vote);
  meta.appendChild(year);

  info.appendChild(titleEl);
  info.appendChild(overviewEl);
  info.appendChild(meta);

  card.appendChild(posterWrapper);
  card.appendChild(info);

  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchNowPlaying();
});

