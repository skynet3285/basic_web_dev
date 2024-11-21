import axios from "axios";

navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  console.log(latitude, longitude);

  const sevenTimerUrl = `http://www.7timer.info/bin/astro.php?lon=${longitude}&lat=${latitude}&ac=0&lang=en&unit=metric&output=internal&tzshift=0`;

  const img = document.getElementById("weather");
  img.src = sevenTimerUrl;
});

const hackerNewsContent = document.getElementById("hacker-news-content");

let isLoading = false;
let allStories = [];
let index = 0;
const indexing = 5;

const prevSelector = document.getElementById("prev");
const nextSelector = document.getElementById("next");
const pageSelector = document.getElementById("page");

prevSelector.addEventListener("click", () => {
  if (isLoading) return;

  if (index > 0) {
    index -= 10;
    hackerNewsContent.innerHTML = "";
    loadHackerNews();
    pageSelector.innerHTML = `<span>${index / 10 + 1}</span>`;
  }
});

nextSelector.addEventListener("click", () => {
  if (isLoading) return;

  if (index < allStories.length - indexing) {
    index += indexing;
    hackerNewsContent.innerHTML = "";
    loadHackerNews();
    pageSelector.innerHTML = `<span>${index / indexing + 1}</span>`;
  }
});

function openInNewWindow(event) {
  event.preventDefault();
  window.open(event.currentTarget.href, "_blank", "width=600, height=800");
}

function createStoryByData(story) {
  const storyElement = document.createElement("article");
  storyElement.classList.add("story-content");
  storyElement.innerHTML = `
    <h1 class="story-title">${story.title}</h1>
    <a class="read-more" href="${story.url}">Read more</a>
  `;
  storyElement
    .getElementsByTagName("a")[0]
    .addEventListener("click", openInNewWindow);

  hackerNewsContent.appendChild(storyElement);
}

async function loadHackerNews() {
  isLoading = true;

  const endIndex = Math.min(index + indexing, allStories.length);
  const storyPromises = allStories.slice(index, endIndex).map((storyId) => {
    return axios
      .get(
        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`
      )
      .then((response) => {
        createStoryByData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  await Promise.all(storyPromises);
  isLoading = false;
}

async function loadAllHackerNews() {
  isLoading = true;

  axios
    .get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
    .then(async (response) => {
      allStories = response.data;

      await loadHackerNews();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading = false;
    });
}

loadAllHackerNews();
