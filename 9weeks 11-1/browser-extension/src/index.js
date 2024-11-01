// form fields
const form = document.querySelector(".form-data");
const region = document.querySelector(".region-name");
const apiKey = document.querySelector(".api-key");

// results
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const results = document.querySelector(".result-container");
const usage = document.querySelector(".carbon-usage");
const fossilfuel = document.querySelector(".fossil-fuel");
const myregion = document.querySelector(".my-region");
const clearBtn = document.querySelector(".clear-btn");

function reset(e) {
  e.preventDefault();
  localStorage.removeItem("regionName");
  init();
}

function handleSubmit(e) {
  e.preventDefault();
  setUpUser(apiKey.value, region.value);
}

function setUpUser(apiKey, regionName) {
  localStorage.setItem("apiKey", apiKey);
  localStorage.setItem("regionName", regionName);
  loading.style.display = "block";
  errors.textContent = "";
  clearBtn.style.display = "block";
  // 다음 시간에
  console.log(apiKey, regionName);
  // displayCarbonUsage(apiKey, regionName);
}

function init() {
  const storedApiKey = localStorage.getItem("apiKey");
  const storedRegion = localStorage.getItem("regionName");
  //set icon to be generic green
  //todo
  if (storedApiKey === null || storedRegion === null) {
    form.style.display = "block";
    results.style.display = "none";
    loading.style.display = "none";
    clearBtn.style.display = "none";
    errors.textContent = "";
  } else {
    displayCarbonUsage(storedApiKey, storedRegion);
    results.style.display = "none";
    form.style.display = "none";
    clearBtn.style.display = "block";
  }
}

form.addEventListener("submit", (e) => handleSubmit(e));
clearBtn.addEventListener("click", (e) => reset(e));

init();
