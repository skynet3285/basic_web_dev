import axios from "axios";

// form fields
const form = document.querySelector(".form-data");
const region1 = document.querySelector(".region-name1");
const region2 = document.querySelector(".region-name2");
const region3 = document.querySelector(".region-name3");
const apiKey = document.querySelector(".api-key");

// results
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const results = document.querySelector(".result-container");
const usage = document.querySelector(".carbon-usage");
const fossilfuel = document.querySelector(".fossil-fuel");
const myregion = document.querySelector(".my-region");
const clearBtn = document.querySelector(".clear-btn");

function handleSubmit(e) {
  e.preventDefault();

  setUpUser(apiKey.value, {
    region1: region1.value,
    region2: region2.value,
    region3: region3.value,
  });
}

async function calculateColor(value) {
  let co2Scale = [0, 150, 600, 750, 800];
  let colors = ["#2AA364", "#F5EB4D", "#9E4229", "#381D02", "#381D02"];
  let closestNum = co2Scale.sort((a, b) => {
    return Math.abs(a - value) - Math.abs(b - value);
  })[0];
  console.log(value + " is closest to " + closestNum);
  let num = (element) => element > closestNum;
  let scaleIndex = co2Scale.findIndex(num);
  let closestColor = colors[scaleIndex];
  console.log(scaleIndex, closestColor);
  chrome.runtime.sendMessage({
    action: "updateIcon",
    value: { color: closestColor },
  });
}

async function displayCarbonUsage(apiKey, regionName) {
  try {
    await axios
      .get("https://api.co2signal.com/v1/latest", {
        params: {
          countryCode: regionName,
        },
        headers: {
          "auth-token": apiKey,
        },
      })
      .then((response) => {
        let CO2 = Math.floor(response.data.data.carbonIntensity);
        calculateColor(CO2);

        loading.style.display = "none";
        form.style.display = "none";
        myregion.textContent = regionName;
        usage.textContent =
          Math.round(response.data.data.carbonIntensity) +
          " grams (grams CO2 emitted per kilowatt hour)";
        fossilfuel.textContent =
          response.data.data.fossilFuelPercentage.toFixed(2) + "%";

        results.style.display = "block";
      });
  } catch (error) {
    console.log(error);
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent =
      "Sorry, we have no data for the region you have requested.";
  }
}

function setUpUser(apiKey, regionNames) {
  localStorage.setItem("apiKey", apiKey);
  localStorage.setItem("regionName", JSON.stringify(regionNames));
  loading.style.display = "block";
  errors.textContent = "";
  clearBtn.style.display = "block";

  displayCarbonUsage(apiKey, regionNames);
}

function getRegionNames() {
  const regionNames = localStorage.getItem("regionNames");
  return regionNames ? JSON.parse(regionNames) : {};
}

function init() {
  const storedApiKey = localStorage.getItem("apiKey");
  const storedRegion = getRegionNames();
  //set icon to be generic green
  chrome.runtime.sendMessage({
    action: "updateIcon",
    value: {
      color: "green",
    },
  });

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

function reset(e) {
  e.preventDefault();
  localStorage.removeItem("regionNames");
  init();
}

form.addEventListener("submit", (e) => handleSubmit(e));
clearBtn.addEventListener("click", (e) => reset(e));

init();
