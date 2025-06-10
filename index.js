const apiKey = "cd3ca636d5f9596dd505f404d59d101f";
const body = document.querySelector("body");
const container = document.querySelector(".container");
const cityInput = document.querySelector("#cityInput");
const weatherForm = document.querySelector(".dropdown-container");

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    toggleDisplay(".dropdown-container");
    try {
        if (cityInput.value) {
            const [weather, forecast] = await getData(cityInput.value);

            if (weather.cod == "404") {
                throw new Error("City name does not exist.");
            }
            displayData(weather, forecast);
        }
    } catch (error) {
        console.error(error);
    }
});

async function getData(city) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherApiUrl);
    const forecastResponse = await fetch(forecastApiUrl);

    return [await weatherResponse.json(), await forecastResponse.json()];
}

async function displayData(weatherData, forecastData) {
    if (!document.querySelector(".temperature")) {
        container.insertAdjacentHTML(
            "beforeend",
            `
            <img src="" alt="" id="emoji" />
            <p class="temperature"></p>
            <p class="description"></p>
            <p class="humidity"></p>
            <div class="scrollable-container"></div>
            `
        );
    }
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }],
    } = weatherData;

    const cityDisplay = document.querySelector("h1");
    const tempDisplay = document.querySelector(".temperature");
    const descDisplay = document.querySelector(".description");
    const humidityDisplay = document.querySelector(".humidity");
    const emojiDisplay = document.querySelector("#emoji");
    const forecastDisplay = document.querySelector(".scrollable-container");

    emojiDisplay.src = await getWeatherElements(id);
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    descDisplay.textContent = `${capitalizeFirst(description)}.`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;

    forecastDisplay.innerHTML = "";
    const nextFewHours = forecastData.list.slice(0, 8);
    nextFewHours.forEach((forecast) => {
        const {
            dt_txt: time,
            weather: [{ id: wId }],
            main: { temp: temperature },
        } = forecast;

        const forecastHTML = ` 
        <div class="scrollable-item">
          <p class="scrollable-text">${time.slice(11, 16)}</p>
          <img src=${getWeatherElements(wId)} alt="" />
          <p class="scrollable-text">${Math.floor(temperature - 273.15)}°C</p>
        </div>`;
        forecastDisplay.innerHTML += forecastHTML;
    });
}

function getWeatherElements(weatherId) {
    if (weatherId >= 200 && weatherId < 300) {
        body.style.backgroundImage = "url(./images/rainy.png)";
        return "./images/thunderstormemoji.png";
    } else if (weatherId >= 300 && weatherId < 600) {
        body.style.backgroundImage = "url(./images/rainy.png)";
        return "./images/rainyemoji.png";
    } else if (weatherId >= 600 && weatherId < 700) {
        body.style.backgroundImage = "url(./images/rainy.png)";
        return "./images/snowyemoji.png";
    } else if (weatherId >= 700 && weatherId < 800) {
        body.style.backgroundImage = "url(./images/cloudy.png)";
        return "./images/windyemoji.png";
    } else if (weatherId === 800) {
        body.style.backgroundImage = "url(./images/clear.png)";
        return "./images/clearemoji.png";
    } else if (weatherId >= 801 && weatherId < 805) {
        body.style.backgroundImage = "url(./images/cloudy.png)";
        return "./images/cloudyemoji.png";
    }
}

function capitalizeFirst(text) {
    return text[0].toUpperCase() + text.slice(1);
}

function toggleDisplay(elementClass) {
    const toToggle = document.querySelector(elementClass);
    if (toToggle.style.display === "flex") {
        toToggle.style.display = "none";
    } else {
        toToggle.style.display = "flex";
    }
}
