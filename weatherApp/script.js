const geoWebsite1 = "http://api.openweathermap.org/geo/1.0/direct?"
const queryEqual = "q="
const appId = "appid="
const apiKey = "978b93b6ba73dd5bd84cbdac72d75673"

const geoWebsite2 = "http://api.openweathermap.org/data/2.5/forecast?"
const lat = "lat="
const lon = "lon="


// const fs = require("fs")
// const { json } = require("stream/consumers")

// async function appendDataToFile(fileName, data){
//     const jsonStringData = JSON.stringify(data, null, 2)

//     fs.appendFile(fileName, jsonStringData + "\n", function (err) {
//         if(err) {throw err};
//         console.log("Data appended to file: ", jsonStringData);
//     })
// }


async function fetchCoordinates(cityName){
    const geoURL = `${geoWebsite1}${queryEqual}${cityName}&${appId}${apiKey}`
    const geoResponse = await fetch(geoURL)
    const geoData = await geoResponse.json()     
    data = geoData[0]

    // await appendDataToFile("data.json", data)   

    return {latitude: geoData[0].lat, longitude: geoData[0].lon}
}


async function fetchWeatherData(latitude, longitude) {
    const cityURL = `${geoWebsite2}${lat}${latitude}&${lon}${longitude}&${appId}${apiKey}`
    const weatherResponse = await fetch(cityURL)
    const weatherData = await weatherResponse.json()
        
    let {list: dataList} = weatherData 
    wData = dataList[0]

    // await appendDataToFile("wData.json", wData)
    
    let { main: tempObj, wind: windSpeedObj, weather: weatherArrObj} = dataList[0];
    
    let {temp: temperatureInKelvin} = tempObj    
    let temperatureInCelcius = Math.floor(temperatureInKelvin - 273.15)                     // temperature

    let {humidity} = tempObj                                                                // humidity

    let {main: weatherDescription} = weatherArrObj[0]                                       // weather description

    let {speed: windSpeedInMs} = windSpeedObj
    let windSpeedInKmph = Math.ceil(windSpeedInMs * 3.6)                                    // windSpeed

    return {temperatureInCelcius, weatherDescription, humidity, windSpeedInKmph};
}


function dynamicWeatherUi(parentContainer) {
    // img
    const weatherImage = document.createElement("img")
    weatherImage.id = "city-weather"
    weatherImage.src = "./images/clear.png"                // default
    parentContainer.appendChild(weatherImage)

    // temperature
    const temperature = document.createElement("p")
    temperature.id = "temp"
    temperature.innerHTML = "30<sup>o</sup> C"              // temperature
    // temperature.style.height = "100%"
    parentContainer.appendChild(temperature)

    // cityName
    const capitalName = document.createElement("p")
    capitalName.id = "cityName"
    capitalName.textContent = "New Delhi"                      // capitalName
    parentContainer.appendChild(capitalName)


    // humidity-wind
    const humidityWind = document.createElement("div")          
    humidityWind.id = "humidity-wind"


        // humidity logo and textContent
    const humidityLogoData = document.createElement("div")
    humidityLogoData.id = "humidity-logo-data"

    const humidityImg = document.createElement("img")
    // humidityImg.id = "humidity-img"
    humidityImg.src = "./images/humidity.png"

    const humidityText = document.createElement("p")            // humidity data
    humidityText.id = "humidity-text"
    humidityText.textContent = "60%"

    humidityLogoData.appendChild(humidityImg)
    humidityLogoData.appendChild(humidityText)


        // wind logo and textContent
    const windLogoData = document.createElement("div")
    windLogoData.id = "wind-logo-data"

    const windImg = document.createElement("img")
    windImg.src = "./images/wind.png"

    let windText = document.createElement("p")                  // wind speed data      
    windText.id = "wind-text"
    windText.textContent = "5 km/h"

    windLogoData.appendChild(windImg)
    windLogoData.appendChild(windText)

    // both div are appended        
    humidityWind.appendChild(humidityLogoData)
    humidityWind.appendChild(windLogoData)

    // added to main container
    parentContainer.appendChild(humidityWind)

    return {temperature, capitalName, humidityText, windText}
}


function styleWeatherUi(containerDiv){
    // main body
    Object.assign(document.body.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        margin: "0",
        color: "#fff",
        backgroundColor: "#212121"
    });
    

    // container
    Object.assign(containerDiv.style, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "420px",
        border: "5px solid #fff"
    })
}


function initializeUI() {
    const container = document.querySelector("#container");
    const { temperature, capitalName, humidityText, windText } = dynamicWeatherUi(container);
    styleWeatherUi(container); // Styling
    return { container, temperature, capitalName, humidityText, windText };
}


async function updateHtml(cityName, temp, weatherDec, humidityData, windSpeedData, uiElements) {
    const { temperature, capitalName, humidityText, windText } = uiElements;

    const images = ["clear.png", "clouds.png", "drizzle.png", "mist.png", "rain.png", "snow.png"];
    temperature.innerHTML = `${temp}<sup>o</sup> C`;
    capitalName.textContent = cityName;

    const match = images.find(img => img === `${weatherDec}.png`);
    if (match) document.querySelector("#weather-image").src = `./images/${match}`;

    humidityText.textContent = `${humidityData} %`;
    windText.textContent = `${windSpeedData} km/h`;
}


async function fetchData(cityName) {
    const { latitude, longitude } = await fetchCoordinates(cityName);
    return await fetchWeatherData(latitude, longitude); // Returns data
}


function setupSearchHandler() {
    const input = document.querySelector("#city-input");
    const searchButton = document.querySelector("#search-city");
    const uiElements = initializeUI();

    searchButton.addEventListener("click", async function () {
        const cityName = input.value.trim();
        if (!cityName) {
            console.log("Enter a valid city");
            return;
        }

        try {
            const { temperatureInCelcius, weatherDescription, humidity, windSpeedInKmph } = await fetchData(cityName);
            updateHtml(cityName, temperatureInCelcius, weatherDescription, humidity, windSpeedInKmph, uiElements);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });
}


setupSearchHandler();

