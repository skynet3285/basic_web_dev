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

function createCarbonElement(data) {
  const content = `
  <p><strong>Region: </strong><span class="my-region">${data.region}</span></p>
  <p><strong>Carbon Usage: </strong><span class="carbon-usage">${data.carbonUsage}</span></p>
  <p><strong>Fossil Fuel Percentage: </strong><span class="fossil-fuel">${data.fossilFuel}</span></p>
`;
  return content;
}

async function displayCarbonUsage(apiKey, regionNames) {
  loading.style.display = "none";
  form.style.display = "none";
  results.style.display = "block";
  console.log(regionNames);

  for (let i = 0; i < regionNames.length; ++i) {
    try {
      console.log(regionNames[i]);

      await axios
        .get("https://api.co2signal.com/v1/latest", {
          params: {
            countryCode: regionNames[i],
          },
          headers: {
            "auth-token": apiKey,
          },
        })
        .then((response) => {
          let CO2 = Math.floor(response.data.data.carbonIntensity);
          calculateColor(CO2);

          // myregion.textContent = regionNames;
          // usage.textContent =
          //   Math.round(response.data.data.carbonIntensity) +
          //   " grams (grams CO2 emitted per kilowatt hour)";
          // fossilfuel.textContent =
          //   response.data.data.fossilFuelPercentage.toFixed(2) + "%";

          const resultDiv = document.createElement("div");
          const data = {
            region: regionNames[i],
            carbonUsage: Math.round(response.data.data.carbonIntensity),
            fossilFuel:
              response.data.data.fossilFuelPercentage.toFixed(2) + "%",
          };
          console.log(`loop : ${i}`, data);

          resultDiv.innerHTML = createCarbonElement(data);
          console.log(resultDiv);
          results.appendChild(resultDiv);
        });
    } catch (error) {
      console.log(error);
      loading.style.display = "none";
      results.style.display = "none";
      errors.textContent =
        "Sorry, we have no data for the region you have requested.";
    }
  }
}

function setUpUser(apiKey, regionNames) {
  localStorage.setItem("apiKey", apiKey);
  localStorage.setItem("regionNames", JSON.stringify(regionNames));
  loading.style.display = "block";
  errors.textContent = "";
  clearBtn.style.display = "block";

  displayCarbonUsage(apiKey, [
    regionNames.region1,
    regionNames.region2,
    regionNames.region3,
  ]);
}

function getRegionNames() {
  const regionNames = localStorage.getItem("regionNames");
  return regionNames ? JSON.parse(regionNames) : null;
}

function init() {
  const storedApiKey = localStorage.getItem("apiKey");
  const storedRegion = getRegionNames();
  console.log(storedApiKey, storedRegion);
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
  console.log("reset");
  init();
}

form.addEventListener("submit", (e) => handleSubmit(e));
clearBtn.addEventListener("click", (e) => reset(e));

init();
