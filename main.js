const apiKey = '7d651b50a9fbd0020af145f45bea3aed'; // Replace with your actual API key

document.getElementById('searchButton').addEventListener('click', fetchWeather);

function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayCurrentWeather(data);
                fetchForecast(city, apiKey);
            } else {
                displayError(data.message);
            }
        })
        .catch(error => {
            displayError('An error occurred while fetching the data.');
        });
}

function fetchForecast(city, apiKey) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayForecast(data);
            } else {
                displayError(data.message);
            }
        })
        .catch(error => {
            displayError('An error occurred while fetching the forecast data.');
        });
}

function displayCurrentWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('currentTemp').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('currentHumidity').textContent = `Humidity: ${data.main.humidity} %`;
    document.getElementById('currentWind').textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('currentDescription').textContent = data.weather[0].description;

    document.querySelector('.city-name-sidebar').textContent = data.name;
    document.querySelector('.current-temp-sidebar').textContent = `${data.main.temp} °C`;
    document.querySelector('.current-description-sidebar').textContent = data.weather[0].description;
    document.getElementById('humiditySidebar').textContent = `Humidity: ${data.main.humidity} %`;
    document.getElementById('windSidebar').textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('descriptionSidebar').textContent = data.weather[0].description;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.getElementById('sunriseSidebar').textContent = `Sunrise: ${sunrise}`;
    document.getElementById('sunsetSidebar').textContent = `Sunset: ${sunset}`;

    document.getElementById('weatherInfo').classList.remove('hidden');
    document.getElementById('forecast').classList.remove('hidden');
    document.querySelector('.sidebar').classList.remove('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const item = data.list[i];
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        
        // Determine the icon based on temperature and weather description
        const temp = item.main.temp;
        const description = item.weather[0].description.toLowerCase();
        let iconSrc = 'icons/default.png'; // Default icon

        if (description.includes('rain')) {
            iconSrc = 'ra.png'; // Path to your rainy weather icon
        } else if (temp >= 25) {
            iconSrc = 'h.png'; // Path to your hot weather icon
        } else if (temp >= 15 && temp < 25) {
            iconSrc = 'm.png'; // Path to your moderate weather icon
        } else {
            iconSrc = 'c.png'; // Path to your cold weather icon
        }

        forecastItem.innerHTML = `
            <h3 class="forecast-date">${new Date(item.dt_txt).toDateString()}</h3>
            <img class="forecast-icon" src="${iconSrc}" alt="weather icon">
            <p class="forecast-temp">Temp: ${item.main.temp} °C</p>
            <p>${item.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}

function displayError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').classList.remove('hidden');
    document.getElementById('weatherInfo').classList.add('hidden');
    document.getElementById('forecast').classList.add('hidden');
    document.querySelector('.sidebar').classList.add('hidden');
}
